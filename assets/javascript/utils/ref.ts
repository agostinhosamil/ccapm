import { RefObject } from 'react'

export const ref = <ElementType = HTMLElement>(): RefObject<ElementType> => ({
  current: null
})
