import { watchElements } from './watchElements'
import { appendElement } from './appendElement'
import { createStyles, CreateStylesProps, StyleProps } from '@utils/styled/createStyles'
import { noEmpty } from '.'
import { App } from '~/App'

function generateClassName() {
  return `el${String(Math.random()).repeat(Math.ceil(Math.random() * 3))}`.split(/\./).join('')
}

export class StyleSheet {
  /**
   * @var StyleProps
   * 
   * stylesheet properties
   * 
   */
  private elementStyles: StyleProps = {}

  /**
   * @var string
   * 
   * stylesheet raw css text
   * 
   */
  private cssText: string = ''

  /**
   * @var string
   * 
   * stylesheet element class name
   * 
   */
  private elementClassName: string = ''

  /**
   * @var CreateStylesProps
   * 
   * stylesheet props
   * 
   */
  private props: Partial<CreateStylesProps> = {}

  /**
   * @var boolean
   * 
   * validate if style was element rendered
   * 
   */
  private styleElementRendered: boolean = false

  /**
   * @var boolean
   * 
   * verify if the styled elements watcher is already running
   * 
   */
  private static watcherRunning: boolean = false

  /**
   * @var string[]
   * 
   * a list of all generated styled elements ids
   * 
   */
  private static styledElementsIds: Array<string> = []

  /**
   * 
   * @param styles
   * @param options 
   */
  constructor(styles: StyleProps, options?: CreateStylesProps) {
    this.props = (typeof options === 'object' && options && typeof options.props === 'object')
      ? options.props
      : {}
    this.elementStyles = styles
    this.elementClassName = generateClassName()
    this.cssText = createStyles(styles, {
      elementRef: `.${this.className}`,
      elementProps: this.props
    })

    this.appendStyleElement()
    this.runWatcher()

    StyleSheet.styledElementsIds.push(this.elementClassName)
  }

  runWatcher(): void {
    if (StyleSheet.watcherRunning) {
      return
    }

    StyleSheet.watcherRunning = true

    const foundStyledElements: Array<string> = []

    watchElements([
      () => {
        StyleSheet.styledElementsIds.forEach(styledElementId => {
          const styledElement = document.querySelector<HTMLElement>(`.${styledElementId}`)

          if (styledElement && foundStyledElements.indexOf(styledElementId) < 0) {
            foundStyledElements.push(styledElementId)
          }
        })

        foundStyledElements.forEach(styledElementId => {
          const styledElementStyles = document.head.querySelector<HTMLStyleElement>(`style[data-styled-element="${styledElementId}"]`)
          const styledElement = document.querySelector<HTMLElement>(`.${styledElementId}`)

          if (styledElementStyles && !styledElement) {
            document.head.removeChild(styledElementStyles)
          }
        })
      }
    ])
  }

  appendStyleElement(): void {
    if (this.styleElementRendered) {
      return
    }

    const styleElement = App.createElement('style', {
      type: 'text/css',
      'data-styled-element': this.className
    },
      this.cssText
    )

    // appendElement(document.head, (
    //   <style type="text/css" data-styled-element={this.className}>
    //     {this.cssText}
    //   </style>
    // ))

    appendElement(document.head, styleElement)

    this.styleElementRendered = true
  }

  get className(): string {
    return String(this.elementClassName)
  }

  get styles(): StyleProps {
    return this.elementStyles
  }
}
