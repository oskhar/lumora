import assert from 'node:assert/strict'
import test from 'node:test'
import { migrateOpeningStock, stockBalances, validateStockMovement, type StockMovement } from '../src/utils/inventory'
const movement = (id: number, direction: 'in' | 'out', quantity: number, productId = 1): StockMovement => ({ id, direction, quantity, productId, reason: 'adjustment', reference: 'TEST', notes: '', createdAt: '2030-01-01T09:00:00Z' })
test('balances are derived from incoming and outgoing movements per product', () => {
  const balances = stockBalances([movement(1, 'in', 12), movement(2, 'out', 5), movement(3, 'in', 3, 2)])
  assert.equal(balances.get(1), 7)
  assert.equal(balances.get(2), 3)
})
test('legacy migration preserves existing balances and removes the stock column', () => {
  const source = [{ id: 1, name: 'Headphones', stock: 21 }, { id: 2, name: 'Mouse', stock: 0 }]
  const { catalog, movements } = migrateOpeningStock(source)
  assert.equal(stockBalances(movements).get(1), 21)
  assert.equal(movements.length, 1)
  assert.equal('stock' in catalog[0], false)
  assert.equal(source[0].stock, 21)
})
test('stock out cannot make a balance negative', () => {
  assert.throws(() => validateStockMovement('out', 6, 5), /Stok tidak cukup/)
  assert.doesNotThrow(() => validateStockMovement('out', 5, 5))
})
test('invalid movement quantities are rejected', () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity]) assert.throws(() => validateStockMovement('in', quantity, 5))
})
test('a return reverses the corresponding stock out without rewriting history', () => {
  const ledger = [movement(1, 'in', 12), movement(2, 'out', 3), movement(3, 'in', 3)]
  assert.equal(stockBalances(ledger).get(1), 12)
  assert.equal(ledger.length, 3)
})
