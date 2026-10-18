export interface ReservedTime {
  date: string
  time: string
  duration: number
  instructor: string
  status?: string
}
export interface TimeSlot {
  time: string
  end: string
  status: 'available' | 'booked' | 'past' | 'closed'
  reason: string
}
export const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
export const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
export const timeRange = (time: string, duration: number) => `${time}–${toTime(toMinutes(time) + duration)}`
export const overlapsTimeRange = (time: string, duration: number, otherTime: string, otherDuration: number) =>
  toMinutes(time) < toMinutes(otherTime) + otherDuration && toMinutes(time) + duration > toMinutes(otherTime)
export function getTimeSlots(options: {
  date: string
  duration: number
  instructor: string
  bookings: ReservedTime[]
  instructorBookings: ReservedTime[]
  now?: Date
}): TimeSlot[] {
  const { date, duration, instructor, bookings, instructorBookings, now = new Date() } = options
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || ![30, 60, 90].includes(duration) || !instructor) return []
  return Array.from({ length: 18 }, (_, index) => {
    const from = 9 * 60 + index * 30
    const time = toTime(from)
    const end = toTime(from + duration)
    const start = new Date(`${date}T${time}:00`).getTime()
    const overlaps = (item: ReservedTime) => item.date === date && item.status !== 'Cancelled'
      && overlapsTimeRange(time, duration, item.time, item.duration)
    if (from + duration > 18 * 60) return { time, end, status: 'closed', reason: 'Durasi melewati jam tutup 18:00' }
    if (!Number.isFinite(start) || start <= now.getTime()) return { time, end, status: 'past', reason: 'Jam ini sudah lewat' }
    if (bookings.some(overlaps)) return { time, end, status: 'booked', reason: 'Anda sudah memiliki sesi pada rentang ini' }
    if (instructorBookings.some(item => item.instructor === instructor && overlaps(item))) return { time, end, status: 'booked', reason: 'Instruktur sudah dipesan pada rentang ini' }
    return { time, end, status: 'available', reason: 'Tersedia untuk dipesan' }
  })
}

// Validate the full selection before callers persist any booking.
export function validateBookingBatch(requests: ReservedTime[], context: {
  bookings: ReservedTime[]
  instructorBookings: ReservedTime[]
  now?: Date
}): void {
  if (!requests.length) throw new Error('Pilih minimal satu jam untuk booking.')
  const accepted: ReservedTime[] = []
  const now = context.now ?? new Date()
  for (const request of requests) {
    const slot = getTimeSlots({ ...request, instructorBookings: context.instructorBookings, now, bookings: [...context.bookings, ...accepted] }).find(item => item.time === request.time)
    if (!slot || slot.status !== 'available') throw new Error(`Sesi ${timeRange(request.time, request.duration)}: ${slot?.reason ?? 'pilih jam dan durasi yang tersedia'}. Belum ada booking yang dibuat.`)
    accepted.push(request)
  }
}
