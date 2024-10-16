import React, { CSSProperties, HTMLAttributes } from 'react'

import { camelToAnyCase } from '..'

export type CreateStylesProps = Partial<{
  elementRef: string
  props: CreateStylesProps,
  elementProps: any,
  inline: boolean,
  children: React.ReactNode | Array<React.ReactNode>
}>

export type StylePropValueReader = {
  [key: string]: (property: any) => any
}

type StyleFunctionProp = <T = any>(props: HTMLAttributes<T>) => any

export type StyleProps = CSSProperties & {
  [key: string]: StyleFunctionProp | string | StyleProps
}

const DEFAULT_PROPS: CreateStylesProps = {
  elementRef: '',
  inline: false
}

export function createStyles(styles: StyleProps, props: CreateStylesProps = DEFAULT_PROPS): string {
  props = typeof props === 'object' ? props : {
    elementRef: ''
  }

  const cssTextLines: Array<string> = []
  const cssChildren: Array<string> = []

  function readCssNumberProp(prop: any) {
    return typeof prop === 'number' ? `${prop}px` : String(prop)
  }

  const stylePropValueReader: StylePropValueReader = {
    width(width) {
      return readCssNumberProp(width)
    },

    height(height) {
      return readCssNumberProp(height)
    },

    padding(padding) {

      const paddingMapper = (padding: string | number) => readCssNumberProp(padding)

      if (padding instanceof Array) {
        switch (padding.length) {
          case 1:
            const [paddingAll] = padding.map(paddingMapper)
            return String(`${paddingAll} `.repeat(4)).trim()
          case 2:
            const [paddingX, paddingY] = padding.map(paddingMapper)
            return `${paddingY} ${paddingX} `.repeat(2).trim()
          case 3:
            const [paddingTop, paddingLeftRight, paddingBottom] = padding.map(paddingMapper)
            return `${paddingTop} ${paddingLeftRight} ${paddingBottom} ${paddingLeftRight}`
          default:
            return padding.map(paddingMapper).slice(0, 4).join(' ')
        }
      }

      if (typeof padding === 'number') {
        return readCssNumberProp(padding)
      }

      return String(padding)
    },

    margin(margin) {
      return this.padding(margin)
    }
  }

  if (typeof styles === 'object') {
    for (const prop in styles) {
      const styleProp = prop as keyof CSSProperties
      const stylePropOriginalValue = styles[styleProp]

      const selfRefs = /^(&)/
      const mediaQueryRe = /^\s*@media\s+/
      const keyframesRe = /^\s*@keyframes\s+/

      const stylePropValue = typeof stylePropOriginalValue === 'function'
        ? (stylePropOriginalValue as StyleFunctionProp)(props.elementProps)
        : stylePropOriginalValue
      const styleValue = typeof stylePropValueReader[styleProp] === 'function'
        ? stylePropValueReader[styleProp].bind(stylePropValueReader)(stylePropValue)
        : stylePropValue
      const stylePropCssName = camelToAnyCase(styleProp, '-').toLowerCase()

      if (typeof styleValue === 'object') {

        const elementRef = selfRefs.test(styleProp)
          ? styleProp.replace(selfRefs, '')
          : ` ${styleProp}`

        const elementStyleValue = styleValue
        const elementAbsoluteRef = `${props.elementRef}${elementRef}`

        if (mediaQueryRe.test(styleProp) && typeof props.elementRef === 'string') {
          const styles = createStyles(elementStyleValue, {
            elementRef: props.elementRef
          })

          cssChildren.push(`${styleProp}{${styles}}`)

          continue
        }

        if (keyframesRe.test(styleProp)) {

          const styles = createStyles(elementStyleValue, {
            elementRef: ''
          })

          cssChildren.push(`${styleProp}{${styles}}`)
          continue
        }

        cssChildren.push(createStyles(elementStyleValue, {
          elementRef: elementAbsoluteRef
        }))

        continue
      }

      cssTextLines.push(`${stylePropCssName}: ${String(styleValue)};`)
    }
  }

  if (props.inline) {
    return cssTextLines.join('')
  }

  const noEmptyCssTextLines = cssTextLines.length >= 1
  const cssTextSlices = [
    noEmptyCssTextLines && props.elementRef,
    noEmptyCssTextLines && '{',
    ...cssTextLines,
    noEmptyCssTextLines && '}',
    ...cssChildren
  ]

  return cssTextSlices.filter(slice => Boolean(slice)).join('')
}

export function createInlineStyles(styles: StyleProps): string {
  return createStyles(styles, {
    inline: true
  })
}
