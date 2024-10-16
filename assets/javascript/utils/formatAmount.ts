export function formatAmount(amount = 0, decCount = 2): string {
  const decRe = /(\.([0-9]+))$/

  decCount = typeof decCount === 'number' && decCount >= 0
    ? parseInt(String(decCount))
    : 2

  const amountValue = Number(amount)

  if (typeof amountValue !== 'number' || isNaN(amountValue)) {
    throw new Error(`Amount must to be a valid number`)
  }

  const amountValueStr = String(amountValue)
  const amountValueDecMatch = amountValueStr.match(decRe) || []
  const amountValueDec = typeof undefined === typeof amountValueDecMatch[2]
    ? '0'.repeat(decCount)
    : String(
      amountValueDecMatch[2].length > decCount
        ? amountValueDecMatch[2].slice(0, decCount)
        : amountValueDecMatch[2] + '0'.repeat(decCount - amountValueDecMatch[2].length)
    )

  let currentTrio: Array<string> = []
  const numberArr: Array<string> = []

  const value = amountValueStr.replace(decRe, '').split('')

  for (let i = -1 + value.length; i >= 0; i--) {
    // currentTrio.push(value[i])
    currentTrio = [value[i], ...currentTrio]


    if (currentTrio.length >= 3) {
      numberArr.push(currentTrio.join(''))
      currentTrio.splice(0, currentTrio.length)
      value.splice(i, 3)
    }
  }

  const filter = (item: number | string) => Boolean(
    typeof item === 'number' || /\S/.test(item)
  )

  return `${[value.join(''), ...(numberArr.reverse())].filter(filter).join('.')}${decCount >= 1 ? `,${amountValueDec}` : ''}`
}

export function formatCoinAmount(amount = 0, decCount = 2, coin = 'AKZ'): string {
  const formattedAmount = formatAmount(amount, decCount)

  return `${coin} ${formattedAmount}`
}
