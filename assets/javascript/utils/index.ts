import { ReactElement, ReactNode } from 'react'
import { config } from '~/config/index'
import { watchElements } from './watchElements'

export type OptionalHTMLElement = HTMLElement | unknown

type Cords = {
  x: number
  y: number
  xz: number
  yz: number
  width: number
  height: number
}

export { ref } from './ref'
export { text } from './text'
export { toast } from './toast'

const pageElementStore: Array<string> = []

watchElements([
  () => {
    /**
     * Map each page element id inside page element store
     * to remove any element which is not present on the page
     */
    for (const pageElementId of pageElementStore) {
      const element = document.querySelector(`[data-page-element-id="${pageElementId}"]`)

      if (!element) {
        pageElementStore.splice(pageElementStore.indexOf(pageElementId), 1)
      }
    }
  }
])

export function mergeArrays<ArrayElementsType = any>(...args: Array<Array<ArrayElementsType>>): Array<ArrayElementsType> {
  const mergedArray: Array<ArrayElementsType> = []

  Array.from(args)
    .filter(arr => arr instanceof Array)
    .forEach(arr => {
      arr.forEach(item => mergedArray.push(item))
    })

  return mergedArray
}

export function camelToAnyCase(string: string, separator: string = '_'): string {
  const separators: Array<string> = [
    '-', '_', '-', '.', '/', '&', '+', '$'
  ]

  separator = separators.indexOf(separator) >= 0 ? separator : '_'

  function matchAll(str: string, re: RegExp) {
    const matches = []

    while (re.test(str)) {
      const strMatch = str.match(re)

      matches.push(String(strMatch && strMatch[0]))

      str = str.replace(re, '')
    }

    return matches
  }

  const separatorAtTheBeginningRe = new RegExp(`^(\\${separator})+`)
  const separatorAtTheEndRe = new RegExp(`(\\${separator})+$`)
  const moreThanOneSeparatorsRe = new RegExp(`(\\${separator}){2,}`)

  const sanitizeStr = (str: string): string => (
    str.toLocaleLowerCase()
      .replace(separatorAtTheBeginningRe, '')
      .replace(separatorAtTheEndRe, '')
      .split(moreThanOneSeparatorsRe)
      .filter(slice => !moreThanOneSeparatorsRe.test(slice))
      .join('')
  )

  if (typeof string === 'string') {
    const camelRe = /[A-Z]/

    const stringCapitalLetters = matchAll(string, camelRe)

    const stringSlices = string
      .split(camelRe)
      .map((stringSlice, stringSliceIndex) => {
        return stringSlice + ((stringCapitalLetters[stringSliceIndex] && (separator + stringCapitalLetters[stringSliceIndex])) || '')
      })

    return sanitizeStr(stringSlices.join(''))
  }

  return sanitizeStr(String(string))
}

export function anyToCamelCase(string: string, separator: string | RegExp = '_'): string {
  if (!(typeof string === 'string'
    && (separator instanceof RegExp || typeof separator === 'string'))) {
    throw new TypeError('Argument list must match [string, string] or [string, RegExp]')
  }

  const camelCaseString = string.split(separator)
    .filter(stringSlice => (separator instanceof RegExp && !separator.test(stringSlice)) || typeof separator === 'string')
    .map(stringSlice => capitalize(stringSlice))
    .join('')

  return camelCaseString.length >= 1 ? camelCaseString[0].toLowerCase() + camelCaseString.slice(1) : ''
}

export const capitalize = (str: string): string => {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length)
  }

  return ''
}

export const ucFirst = (str: string): string => capitalize(str)

export const lcFirst = (str: string): string => {
  const firstChar = (str.charAt(0) || '').toLowerCase()

  return firstChar + str.slice(1, str.length)
}

export const regReplaceCallback = (re: RegExp, subject: string, callback: (match: RegExpExecArray) => string): string => {
  const matches: Array<RegExpExecArray> = []
  const slices: Array<string> = []

  let subjectStr: string = subject

  let match = re.exec(subjectStr)

  while (match) {
    const matchStr = match[0]

    matches.push(match)

    slices.push(subjectStr.slice(0, match.index))

    subjectStr = subStrReplace(subjectStr, 0, match.index + matchStr.length, '')

    match = re.exec(subjectStr)
  }

  if (slices.length >= 1) {
    return slices.map((slice, index) => `${slice}${callback(matches[index])}`).join('')
  }

  return subject
}

export const elementOffsetHeight = (element: OptionalHTMLElement): number => {
  if (element instanceof HTMLElement) {
    const elementCords = element.getBoundingClientRect()

    return elementCords.height
  }

  return -1
}

export const elementOffsetY = (element: OptionalHTMLElement): number => {
  if (element instanceof HTMLElement) {
    const elementCords = element.getBoundingClientRect()

    return elementCords.y
  }

  return -1
}

export const elementOffsetYZ = (element: OptionalHTMLElement): number => {
  if (element instanceof HTMLElement) {
    const elementCords = element.getBoundingClientRect()

    return elementCords.y + elementCords.height
  }

  return -1
}

export const elementOffsetWidth = (element: OptionalHTMLElement): number => {
  if (element instanceof HTMLElement) {
    const elementCords = element.getBoundingClientRect()

    return elementCords.width
  }

  return -1
}

export const elementOffsetX = (element: OptionalHTMLElement): number => {
  if (element instanceof HTMLElement) {
    const elementCords = element.getBoundingClientRect()

    return elementCords.x
  }

  return -1
}

export const elementOffsetXZ = (element: OptionalHTMLElement): number => {
  if (element instanceof HTMLElement) {
    const elementCords = element.getBoundingClientRect()

    return elementCords.x + elementCords.width
  }

  return -1
}

export const elementCords = (element: OptionalHTMLElement): Cords => {
  return {
    x: elementOffsetX(element),
    y: elementOffsetY(element),
    xz: elementOffsetXZ(element),
    yz: elementOffsetYZ(element),
    height: elementOffsetHeight(element),
    width: elementOffsetWidth(element),
  }
}

export const getElementStyle = <T = string>(element: OptionalHTMLElement, prop: string): T => {
  if (element instanceof HTMLElement) {
    const styles = window.getComputedStyle(element)

    const value = styles[prop as keyof CSSStyleDeclaration]

    if (typeof value !== 'undefined') {
      return value as T
    }
  }

  return '' as T
}

export const elementsCollide = (elementA: OptionalHTMLElement, elementB: OptionalHTMLElement): boolean => {
  const elementACords = elementCords(elementA)
  const elementBCords = elementCords(elementB)

  const collisionConditions: Array<boolean> = [
    elementACords.xz > elementBCords.x && elementACords.yz > elementBCords.y,
    elementBCords.xz > elementACords.x && elementBCords.yz > elementACords.y,
  ]

  const asserted = collisionConditions.filter(condition => Boolean(condition))

  return Boolean(asserted.length >= collisionConditions.length)
}

export const path = (...paths: Array<string | number>): string => {
  const pathSlices: Array<string> = []

  paths.map<string>(pathSlice => String(pathSlice))
    .forEach(pathSlice => {
      const re = /\/+/
      pathSlice.split(re)
        .filter(pathSliceSlice => (
          !re.test(pathSliceSlice) && noEmpty(pathSliceSlice)
        ))
        .forEach(pathSliceSlice => {
          pathSlices.push(pathSliceSlice)
        })
    })

  const pathPrefix = /^(\.+(\/)?)/.test(pathSlices[0])
    ? window.location.pathname
    : config.pathPrefix

  let relativePath = pathPrefix.replace(/\/+$/, '')

  const pathSlicesFilter = (pathSlice: string) => (
    pathSlice !== '.' && noEmpty(pathSlice)
  )

  const pathSlicesMapper = (pathSlice: string) => {
    if (pathSlice === '..') {
      relativePath = dirname(relativePath)
      return
    }

    relativePath += `/${pathSlice}`
  }

  pathSlices.filter(pathSlicesFilter)
    .forEach(pathSlicesMapper)

  return relativePath
}

export const imageUrl = (imageFileName: string): string => (
  `${config.pathPrefix}/public/assets/images/${imageFileName}`
)

export const uploadedImageUrl = (imageFileName: string): string => (
  `${config.pathPrefix}/static/uploads/${imageFileName}`
)

export const cssNumProp = (element: OptionalHTMLElement, prop: string) => {
  if (element instanceof HTMLElement) {
    const styles = window.getComputedStyle(element)
    const num = parseFloat(String(styles[prop as keyof CSSStyleDeclaration]))

    return !isNaN(num) ? 0 : num
  }

  return 0
}

export const dirname = (path: string): string => {
  const re = /(\/|\\)+/
  const pathSlices = path.split(re)
    .filter(pathSlice => !re.test(pathSlice))

  return pathSlices.slice(0, -1).join('/')
}

export const empty = (string: any): boolean => Boolean(typeof string === 'string' && !/\S/.test(string))

export const noEmpty = (string: any): boolean => Boolean(typeof string === 'string' && !empty(string))

export const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

export const j = (element: ReactElement): HTMLElement => {
  if (element instanceof HTMLElement) {
    return element
  }

  return document.createElement('div')
}

export const r = (element: HTMLElement | ReactNode): ReactNode => {
  // @ts-ignore
  return element
}

export const getObjectProp = <PropertyType = any>(dataObject: any, propertyRef: string): (PropertyType | undefined) => {
  const re = /\.+/
  const numberRe = /^([0-9]+)$/
  const propertyRefSlices = propertyRef.split(re)
    .filter(slice => !re.test(slice))

  let propertyValue: any = dataObject

  if (typeof propertyValue !== 'object') {
    return
  }

  for (let i = 0; i < propertyRefSlices.length; i++) {
    const propertyRefSlice = numberRe.test(propertyRefSlices[i])
      ? Number(propertyRefSlices[i])
      : propertyRefSlices[i]

    // if (propertyValue instanceof Array) {

    //   if (
    //     && typeof propertyValue[Number(propertyRefSlice)] !== typeof undefined) {
    //     propertyValue = propertyValue[Number(propertyRefSlice)]
    //   }

    //   continue
    // }

    if (typeof propertyValue === 'object'
      && typeof propertyValue[propertyRefSlice] !== typeof undefined) {
      propertyValue = propertyValue[propertyRefSlice]

      continue
    }

    return
  }

  return propertyValue as PropertyType
}

export const getLanguageData = (): any => {
  const dataLanguageScriptElement = document.querySelector<HTMLScriptElement>('script[data-property="application-language-data"]')

  if (dataLanguageScriptElement) {
    try {
      return JSON.parse(dataLanguageScriptElement.innerText.trim())
    } catch (err) {
      // pass...
    }
  }

  return {}
}

export function arraySplit<ArrayElementType = any>(array: Array<ArrayElementType>, group: number = 1): Array<Array<ArrayElementType>> {
  if (!(typeof array === 'object' && array instanceof Array)) {
    throw new TypeError('arraySplit: parameter 0 musts to be an array')
  }

  const newArray: Array<Array<ArrayElementType>> = []

  group = !isNaN(group) && group >= 1 ? group : 1;

  for (var i = 0; i < array.length; i += group) {
    if (typeof undefined === typeof array[i]) {
      continue;
    }

    const currentArray: Array<ArrayElementType> = []

    for (let n = i; n < group + i; n++) {
      if (typeof undefined !== typeof array[n]) {
        currentArray.push(array[n])
      }
    }

    newArray.push(currentArray)
  }

  return newArray
}

export const range = (min: number, max: number): Array<number> => {
  const arr: Array<number> = []

  for (; min <= max; min++) {
    arr.push(min)
  }

  return arr
}

export const rand = (min: number, max: number): number => {
  return randFromRange(range(min, max))
}

export const generateUniqueId = (): string => (
  String(Math.random())
    .replace('.', '')
    .repeat(Math.round(Math.random() * 4) + 1)
)

export const randFromRange = (numberRange: Array<number>): number => {
  return numberRange[Math.round(Math.random() * (-1 + numberRange.length))]
}

export const noNullHref = (hrefText: string): boolean => {
  if (!noEmpty(hrefText)) {
    return false
  }

  const nullHrefRe = /^(#)/

  return !(nullHrefRe.test(String(hrefText).trim()))
}

export const subStrReplace = (string: string, start: number, end: number, replaceData: string | null = null): string => {
  replaceData = String(replaceData)

  if (!(typeof string === 'string')) {
    throw new TypeError('first argument must be a string')
  }

  const newStringContent = [
    string.slice(0, start),
    replaceData,
    string.slice(end, string.length)
  ]

  return newStringContent.join('')
}

export const getElementJsonAttribute = <AttributeType = any>(element: HTMLElement, attributeName: string): AttributeType => {
  let attributeValue = String(element.getAttribute(attributeName))

  try {
    attributeValue = JSON.parse(attributeValue)
  } catch (err) {
    // pass
  } finally {
    return attributeValue as AttributeType
  }
}

export const orderNumbers = (numbers: Array<number>): Array<number> => {
  let i = 0

  const numbersCount = numbers.length

  for (; i < numbersCount; i++) {
    const history = {
      min: numbers[i],
      minIndex: i
    }

    for (let n = i; n < numbersCount; n++) {
      if (numbers[n] <= history.min) {
        history.min = numbers[n]
        history.minIndex = n
      }
    }

    numbers[history.minIndex] = numbers[i]
    numbers[i] = history.min
  }

  return numbers
}

export const getPlanPrices = (basePrice: number = 1, count: number = 1): Array<number> => {
  const prices: Array<number> = [basePrice]

  let currentPlanPrice = basePrice

  for (let i = 0; i < count; i++) {
    const percent: number = (720 / (i >= 3 ? prices.length : 1)) / 100

    currentPlanPrice = currentPlanPrice * percent

    prices.push(currentPlanPrice)
  }

  return orderNumbers(prices)
}

export const registerPageElement = (element: HTMLElement): void => {
  if (registeredPageElement(element)) {
    return
  }

  const elementId = generateUniqueId()

  element.setAttribute('data-page-element-id', elementId)

  pageElementStore.push(elementId)
}

export const registeredPageElement = (element: HTMLElement): boolean => {
  const elementId = element.getAttribute('data-page-element-id')

  return (
    typeof elementId === 'string'
    && pageElementStore.indexOf(elementId) >= 0
  )
}

export const isElementChildOf = (element: HTMLElement, parentNode: HTMLElement): boolean => {
  const parentNodeChildren = Array.from(parentNode.children)

  return parentNodeChildren.includes(element)
}
