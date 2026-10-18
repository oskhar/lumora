export interface StockMovement {
  id: number
  productId: number
  direction: 'in' | 'out'
  quantity: number
  reason: 'opening' | 'receipt' | 'sale' | 'return' | 'usage' | 'damage' | 'adjustment'
  reference: string
  notes: string
  createdAt: string
  orderId?: number
}
export function stockBalances(movements: StockMovement[]): Map<number, number> {
  const balances = new Map<number, number>()
  for (const movement of movements) balances.set(movement.productId, (balances.get(movement.productId) ?? 0) + (movement.direction === 'in' ? movement.quantity : -movement.quantity))
  return balances
}
export function validateStockMovement(direction: string, quantity: number, balance: number): void {
  if (!['in', 'out'].includes(direction)) throw new Error('Pilih stok masuk atau stok keluar.')
  if (!Number.isSafeInteger(quantity) || quantity < 1) throw new Error('Jumlah harus berupa bilangan bulat minimal 1.')
  const result = balance + (direction === 'in' ? quantity : -quantity)
  if (result < 0) throw new Error(`Stok tidak cukup. Saldo tersedia ${balance} unit.`)
  if (!Number.isSafeInteger(result)) throw new Error('Jumlah stok terlalu besar.')
}
export function migrateOpeningStock<T extends { id: number; stock?: number }>(products: T[], createdAt = new Date().toISOString()) {
  const movements: StockMovement[] = []
  const catalog = products.map(({ stock, ...product }) => {
    const quantity = Math.max(0, Math.floor(Number(stock) || 0))
    if (quantity > 0) movements.push({ id: movements.length + 1, productId: product.id, direction: 'in', quantity, reason: 'opening', reference: 'SALDO-AWAL', notes: 'Saldo awal dari migrasi data stok lama. Transaksi lama tidak dihitung ulang.', createdAt })
    return product
  })
  return { catalog, movements }
}
export const movementReasonLabel = (reason: StockMovement['reason']) => ({ opening: 'Saldo awal', receipt: 'Penerimaan barang', sale: 'Penjualan', return: 'Pengembalian barang', usage: 'Pemakaian internal', damage: 'Rusak / hilang', adjustment: 'Penyesuaian stok' })[reason]
