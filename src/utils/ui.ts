export const statusLabel = (value: string) => ({ Active: 'Aktif', Draft: 'Draft', Pending: 'Menunggu', Paid: 'Lunas', Processing: 'Diproses', Shipped: 'Dikirim', Completed: 'Selesai', Cancelled: 'Dibatalkan', Confirmed: 'Terkonfirmasi' })[value] ?? value
export const statusOptions = (values: string[]) => values.map(value => ({ title: statusLabel(value), value }))
export const required = (label: string) => (value: unknown) => !!String(value ?? '').trim() || `${label} wajib diisi.`
