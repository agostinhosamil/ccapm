import { camelToAnyCase, getLanguageData, getObjectProp, path } from "."

export type TextArgumentsList = Array<string | number | Array<string>>

export const text = (key: string, ...args: TextArgumentsList): string => {
  const languageData = getLanguageData()

  const snakeCaseKey = camelToAnyCase(key, '_')

  const textContentAlternates: Array<string> = [
    key,
    `text.${key}`,
    snakeCaseKey,
    `text.${snakeCaseKey}`,
  ]

  for (let keyAlternate of textContentAlternates) {

    let textContent = getObjectProp<string>(languageData, keyAlternate)

    if (!textContent) {
      continue
    }

    textContent = String(textContent)

    const textParameterRe = /\$([0-9]+)(\(([^\)]+)\))?/

    const textParameterReplacer = (textParameterMatch: RegExpExecArray): string => {
      const dataParameterIndex = Number(textParameterMatch[1])

      let dataParameterValue = (args[dataParameterIndex])
        ? args[dataParameterIndex]
        : ''

      if (typeof textParameterMatch[2] === typeof undefined) {
        return String(dataParameterValue)
      }

      const linkLabel = (typeof textParameterMatch[3] !== typeof undefined)
        ? textParameterMatch[3]
        : dataParameterValue

      if (dataParameterValue instanceof Array) {
        dataParameterValue = dataParameterValue.join('/')
      }

      const linkUrl = path(dataParameterValue)

      return `<a href="${linkUrl}">${linkLabel}</a>`
    }

    while (textParameterRe.test(String(textContent))) {
      const textParameterMatch = textParameterRe.exec(String(textContent))

      if (textParameterMatch) {
        textContent = textContent.replace(textParameterRe, textParameterReplacer(textParameterMatch))
      }
    }

    return textContent
  }

  return ''
}
