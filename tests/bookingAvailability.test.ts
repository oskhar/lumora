import assert from 'node:assert/strict'
import test from 'node:test'
import { getTimeSlots, validateBookingBatch } from '../src/utils/bookingAvailability'

const base = { date: '2030-05-10', duration: 60, instructor: 'Nadia', bookings: [], instructorBookings: [], now: new Date('2030-05-09T12:00:00') }
test('shows available starts in 30-minute increments', () => {
  const slots = getTimeSlots(base)
  assert.equal(slots.length, 18)
  assert.equal(slots[0].time, '09:00')
  assert.equal(slots[0].end, '10:00')
  assert.equal(slots[0].status, 'available')
})
test('instructor reservations block partial overlaps but allow adjacent sessions', () => {
  const slots = getTimeSlots({ ...base, instructorBookings: [{ date: base.date, time: '10:00', duration: 60, instructor: 'Nadia' }] })
  assert.equal(slots.find(s => s.time === '09:00')?.status, 'available')
  assert.equal(slots.find(s => s.time === '09:30')?.status, 'booked')
  assert.equal(slots.find(s => s.time === '10:30')?.status, 'booked')
  assert.equal(slots.find(s => s.time === '11:00')?.status, 'available')
})
test('other instructors do not block availability', () => {
  const slots = getTimeSlots({ ...base, instructorBookings: [{ date: base.date, time: '10:00', duration: 60, instructor: 'Maya' }] })
  assert.equal(slots.find(s => s.time === '10:00')?.status, 'available')
})
test('learner bookings block simultaneous sessions with any instructor', () => {
  const slots = getTimeSlots({ ...base, bookings: [{ date: base.date, time: '10:00', duration: 30, instructor: 'Maya', status: 'Confirmed' }] })
  assert.equal(slots.find(s => s.time === '10:00')?.status, 'booked')
})
test('cancelled bookings release their slot', () => {
  const slots = getTimeSlots({ ...base, bookings: [{ date: base.date, time: '10:00', duration: 60, instructor: 'Nadia', status: 'Cancelled' }] })
  assert.equal(slots.find(s => s.time === '10:00')?.status, 'available')
})
test('duration must fit completely within working hours', () => {
  assert.equal(getTimeSlots(base).find(s => s.time === '17:00')?.status, 'available')
  assert.equal(getTimeSlots(base).find(s => s.time === '17:30')?.status, 'closed')
  assert.equal(getTimeSlots({ ...base, duration: 90 }).find(s => s.time === '17:00')?.status, 'closed')
})
test('elapsed times cannot be booked', () => {
  const slots = getTimeSlots({ ...base, now: new Date(`${base.date}T10:15:00`) })
  assert.equal(slots.find(s => s.time === '10:00')?.status, 'past')
  assert.equal(slots.find(s => s.time === '10:30')?.status, 'available')
})
test('invalid durations return no choices', () => {
  assert.deepEqual(getTimeSlots({ ...base, duration: 45 }), [])
})

const request = (time: string) => ({ date: base.date, time, duration: 60, instructor: 'Nadia' })
test('batch accepts adjacent sessions such as 09–10 and 10–11', () => {
  assert.doesNotThrow(() => validateBookingBatch([request('09:00'), request('10:00')], base))
})
test('batch accepts separate non-consecutive sessions', () => {
  assert.doesNotThrow(() => validateBookingBatch([request('09:00'), request('13:00')], base))
})
test('batch rejects overlapping choices', () => {
  assert.throws(() => validateBookingBatch([request('09:00'), request('09:30')], base), /Anda sudah memiliki sesi/)
})
test('batch rejects duplicate choices', () => {
  assert.throws(() => validateBookingBatch([request('09:00'), request('09:00')], base), /Anda sudah memiliki sesi/)
})
test('a conflict in a later selection leaves existing bookings untouched', () => {
  const existing = [request('13:00')]
  const before = structuredClone(existing)
  assert.throws(() => validateBookingBatch([request('09:00'), request('13:00')], { ...base, bookings: existing }))
  assert.deepEqual(existing, before)
})
test('batch rechecks instructor reservations for every selection', () => {
  assert.throws(() => validateBookingBatch([request('09:00'), request('10:00')], { ...base, instructorBookings: [request('10:00')] }), /Instruktur sudah dipesan/)
})
test('batch rejects an empty selection', () => {
  assert.throws(() => validateBookingBatch([], base), /minimal satu/)
})
test('batch rejects a session extending beyond closing time', () => {
  assert.throws(() => validateBookingBatch([request('09:00'), request('17:30')], base), /jam tutup/)
})
