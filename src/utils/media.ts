const productPhotos: Record<string, string> = {
  'LM-AU-001': 'headphones', 'LM-WS-002': 'keyboard', 'LM-AU-003': 'speaker',
  'LM-WS-004': 'lamp', 'LM-EV-005': 'backpack', 'LM-EV-006': 'bottle',
  'LM-WS-007': 'mouse', 'LM-AU-008': 'microphone', 'LM-WS-009': 'clock', 'LM-EV-010': 'travel-case',
}
export const productImage = (product: { sku: string; image?: string }) => product.image || (productPhotos[product.sku] ? `/images/products/${productPhotos[product.sku]}.jpg` : undefined)
export const courseImage = (id: number) => `/images/courses/${({ 1: 'design', 2: 'development', 3: 'photography', 4: 'communication' } as Record<number, string>)[id] ?? 'design'}.jpg`
export const photoOptions = [
  { title: 'Tanpa foto — gunakan ilustrasi', value: '' },
  ...Object.values(productPhotos).map(name => ({ title: ({ headphones: 'Headphone studio', keyboard: 'Keyboard', speaker: 'Speaker portabel', lamp: 'Lampu meja', backpack: 'Tas ransel', bottle: 'Botol minum', mouse: 'Mouse nirkabel', microphone: 'Mikrofon', clock: 'Jam meja', 'travel-case': 'Pouch perjalanan' } as Record<string, string>)[name], value: `/images/products/${name}.jpg` })),
]
