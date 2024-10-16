import { CSSProperties } from 'react'
import { App } from '~/App'
import { elementCords, elementsCollide, generateUniqueId, getElementStyle, ref } from '~/utils'

type SelectAreaElementHandlers = {
  [key: string]: (this: HTMLElement, event: MouseEvent) => void
}

type SelectCursorAxis = {
  x: number
  y: number
  state: {
    x: number
    y: number
  }
}

type Cords = {
  x: number
  y: number
  width: number
  height: number
}

type Styles = {
  [key: string]: CSSProperties
}

export type SelectAreaSelectedElement = {
  id: string
  element: HTMLElement
  props: any
}

export type SelectAreaSelectedElementsMap = {
  [key: string]: SelectAreaSelectedElement
}

export type SelectArea = {
  id: string
  key: string
  selected: SelectAreaSelectedElementsMap
  selectionIteration: Array<string>
  deselectionIteration: Array<string>

  onChange: (callback: SelectAreaContextChangeEventCallback) => void
  changeEventHandlers: Array<SelectAreaContextChangeEventCallback>
  select: (element: SelectAreaSelectedElement) => SelectAreaSelectedElement
  clear: () => void
  removeElement: (elementId: string) => SelectAreaSelectedElement
  isAreaSelectButton: (buttonElement: HTMLElement) => boolean
  get selectedElements(): Array<SelectAreaSelectedElement>
}

export type SelectAreasMap = {
  [key: string]: SelectArea
}

type SelectAreaContextChangeEventCallback = (selectedElements: Array<SelectAreaSelectedElement>) => void

export type SelectAreaFunc = (key: string) => SelectArea

export type ReachedElementsMarker = (this: HTMLElement, event: MouseEvent, select: boolean) => void

const handledSelectAreas: SelectAreasMap = {}

const handledSelectArea = (selectAreaElementId: string | null): boolean => {
  if (typeof selectAreaElementId === 'string') {
    return typeof handledSelectAreas[selectAreaElementId] !== 'undefined'
  }

  return false
}

export const selectArea: SelectAreaFunc = (key: string) => {
  const selectAreaObject = Object.values(handledSelectAreas)
    .find(selectAreaElement => (
      selectAreaElement.key === key
    ))

  if (typeof selectAreaObject === 'object') {
    return selectAreaObject
  }

  throw new Error(`Key: '${key}' does not refer to a valid select area element`)
}

export const setSelectAreaElementsUp = () => {
  const selectAreaElements = Array.from(document.querySelectorAll<HTMLElement>('[data-select-area]'))

  for (const selectAreaElement of selectAreaElements) {
    if (handledSelectArea(selectAreaElement.getAttribute('data-select-area-id'))) {
      continue
    }

    const selectCursorRef = ref<HTMLDivElement>()
    const selectAreaElementId = generateUniqueId()

    const selectCursorAxis: SelectCursorAxis = {
      x: 0,
      y: 0,
      state: {
        x: 0,
        y: 0
      }
    }

    const selectAreaElementKey = String(selectAreaElement.getAttribute('data-select-area'))

    selectAreaElement.setAttribute('data-select-area-id', selectAreaElementId)
    handledSelectAreas[selectAreaElementId] = {
      id: selectAreaElementId,
      key: selectAreaElementKey,
      selected: {},
      selectionIteration: [],
      deselectionIteration: [],
      changeEventHandlers: [],
      onChange(callback) {
        this.changeEventHandlers.push(callback)
      },
      select(element) {
        this.selected[element.id] = element

        this.changeEventHandlers.forEach((changeEventHandler) => {
          changeEventHandler(this.selectedElements)
        })

        return element
      },
      removeElement(elementId) {
        const element = this.selected[elementId]

        delete this.selected[elementId]

        this.changeEventHandlers.forEach((changeEventHandler) => {
          changeEventHandler(this.selectedElements)
        })

        return element
      },
      /**
       * 
       * @param buttonElement HTMLElement
       */
      isAreaSelectButton(buttonElement) {
        const isAreaSelectButton = (buttonElement: HTMLElement): boolean => {
          const dataAreaSelectKey = buttonElement.getAttribute('data-area-select-button')

          return (typeof dataAreaSelectKey === 'string' && dataAreaSelectKey === this.key)
        }

        if (isAreaSelectButton(buttonElement)) {
          return true
        }

        let elementParent = buttonElement.parentNode as HTMLElement

        while (elementParent instanceof HTMLElement) {
          if (isAreaSelectButton(elementParent)) {
            return true
          }

          elementParent = elementParent.parentNode as HTMLElement
        }

        return false
      },
      /**
       * clear whole the selected elements
       */
      clear() {
        this.selected = {}
      },
      get selectedElements() {

        const selectedElementCovers = Array.from(document.querySelectorAll<HTMLDivElement>('[data-selectable-element-cover]'))

        return selectedElementCovers.map<SelectAreaSelectedElement>((selectedElementCover) => {
          const selectedElementId = String(selectedElementCover.getAttribute('data-selectable-element-cover'))
          const selectableElement = selectAreaElement.querySelector((`[data-selectable-id="${selectedElementId}"]`))

          if (!(selectableElement instanceof HTMLElement)) {
            throw new TypeError('something went wrong: selectableElement not found in the DOM')
          }

          return {
            element: selectableElement,
            id: selectedElementId,
            props: getSelectableElementData(selectableElement)
          }
        })
      }
    }

    const selectableDataObject = selectArea(selectAreaElementKey)

    const selectedElementCovered = (elementId: string): boolean => {
      const selectedElementCovers = Array.from(document.querySelectorAll<HTMLDivElement>(`[data-selectable-element-cover="${elementId}"]`))

      return selectedElementCovers.length >= 1
    }

    const getSelectableElementData = (selectableElement: HTMLElement): any => {
      let selectableElementData = String(selectableElement.getAttribute('data-selectable'))

      try {
        selectableElementData = JSON.parse(selectableElementData)
      } catch (err) {
        // pass
      }

      return selectableElementData
    }

    const selectElementByObject = (element: HTMLElement): void => {
      const { width, height } = elementCords(element)

      const elementId: string = String(element.getAttribute('data-selectable-id'))

      if (selectedElementCovered(elementId)) {
        return
      }

      const styles: Styles = {
        container: {
          width: `${width}px`,
          height: `${height}px`,
          border: '1px solid #bca4eb',
          backgroundColor: 'rgb(188 164 235 / 12%)',
          position: 'absolute',
          zIndex: '20',
          top: `0px`,
          left: `0px`,
          borderTopLeftRadius: getElementStyle(element, 'borderTopLeftRadius'),
          borderTopRightRadius: getElementStyle(element, 'borderTopRightRadius'),
          borderBottomLeftRadius: getElementStyle(element, 'borderBottomLeftRadius'),
          borderBottomRightRadius: getElementStyle(element, 'borderBottomRightRadius'),
        },

        checkboxWrapper: {
          position: 'absolute',
          top: '5px',
          right: '5px'
        }
      }

      const selectedElementCssPosition = getElementStyle(element, 'position')

      if (!/^(relative|fixed|absolute)$/i.test(selectedElementCssPosition)) {
        element.style.position = 'relative'
      }

      // const selectedElementCover = (
      //   <div style={styles.container} data-selectable-element-cover={elementId}>
      //     <div style={styles.checkboxWrapper}>
      //       <div className="form-check">
      //         <input
      //           data-selectable-element-cover-check={elementId}
      //           className="form-check-input"
      //           type="checkbox"
      //           name="request[delivery]"
      //           onChange={(event) => !event.target.checked && deselectElement(elementId)}
      //           checked
      //         />
      //       </div>
      //     </div>
      //   </div>
      // )

      const selectedElementCover = App.createElement('div', {
        style: styles.container,
        'data-selectable-element-cover': elementId
      },
        App.createElement('div', { style: styles.checkboxWrapper },
          App.createElement('div', { className: 'form-check' },
            App.createElement('input', {
              'data-selectable-element-cover-check': elementId,
              className: 'form-check-input',
              type: 'checkbox',
              name: `deselect[${elementId}]`,
              onChange: (event) => {
                const inputElement = event.target as HTMLInputElement
                !inputElement.checked && deselectElement(elementId)
              },
              checked: true
            })
          )
        )
      )

      element.appendChild(selectedElementCover)
    }

    const deselectAllElements = (): void => {
      const selectedElementCovers = Array.from(document.querySelectorAll<HTMLDivElement>(`[data-selectable-element-cover]`))

      selectableDataObject.clear()

      selectedElementCovers.forEach(selectedElementCover => {
        selectedElementCover.parentNode?.removeChild(selectedElementCover)
      })
    }

    const isElementInsideASelectableElement = (element: HTMLElement): boolean => {
      const isSelectableElement = (element: HTMLElement): boolean => {
        const elementAttributes = element.getAttributeNames()
        return elementAttributes.includes('data-selectable-id')
      }

      if (isSelectableElement(element)) {
        return true
      }

      let elementParent = element.parentNode as HTMLElement

      while (elementParent instanceof HTMLElement) {
        if (isSelectableElement(elementParent)) {
          return true
        }

        elementParent = elementParent.parentNode as HTMLElement
      }

      return false
    }

    const removeElementCover = (elementId: string): void => {
      const selectedElementCovers = Array.from(document.querySelectorAll<HTMLDivElement>(`[data-selectable-element-cover="${elementId}"]`))

      selectedElementCovers.forEach(selectedElementCover => {
        selectedElementCover.parentNode?.removeChild(selectedElementCover)
      })
    }

    const deselectElement = (elementId: string): void => {
      if (typeof selectableDataObject.selected[elementId] !== 'undefined') {
        selectableDataObject.removeElement(elementId)
      }

      removeElementCover(elementId)
    }

    const markReachedElements: ReachedElementsMarker = function (event) {
      const selectableElements = Array.from(this.querySelectorAll<HTMLElement>('[data-selectable]'))

      for (const selectableElement of selectableElements) {
        const selectableElementId = String(selectableElement.getAttribute('data-selectable-id'))

        if (elementsCollide(selectableElement, selectCursorRef.current)) {
          const selectableElementPreviouslySelected = !selectableDataObject.selectionIteration.includes(selectableElementId)


          if ((selectableElementPreviouslySelected && !!(event.ctrlKey))) {
            if (selectedElementCovered(selectableElementId)) {
              selectableDataObject.selectionIteration.push(selectableElementId)

              removeElementCover(selectableElementId)
            }
          }

          if (!selectableDataObject.selectionIteration.includes(selectableElementId)) {
            selectableDataObject.selectionIteration.push(selectableElementId)

            selectElementByObject(selectableElement)

            continue
          }

          continue
        }

        // NO COLLISION

        const selectableElementPreviouslySelected = selectableDataObject.selectionIteration.includes(selectableElementId)

        if (selectableElementPreviouslySelected) {
          removeElementCover(selectableElementId)

          selectableDataObject.selectionIteration
            .splice(selectableDataObject.selectionIteration.indexOf(selectableElementId), 1)
        }
      }
    }

    const selectableElements = Array.from(selectAreaElement.querySelectorAll<HTMLElement>('[data-selectable]'))

    for (const selectableElement of selectableElements) {
      selectableElement.setAttribute('data-selectable-id', generateUniqueId())
    }

    const selectAreaElementHandlers: SelectAreaElementHandlers = {
      mousedown(event) {
        const styles: CSSProperties = {
          minWidth: '0px',
          minHeight: '0px',
          border: '1px solid #bca4eb',
          backgroundColor: 'rgb(188 164 235 / 12%)',
          position: 'fixed',
          top: `${event.clientY}px`,
          left: `${event.clientX}px`,
        }

        const targetElement = event.target as HTMLElement

        if (isElementInsideASelectableElement(targetElement)) {
          return
        }

        selectCursorAxis.x = event.clientX
        selectCursorAxis.y = event.clientY

        Object.assign(selectCursorAxis.state, {
          x: event.clientX,
          y: event.clientY
        })

        // this.appendChild(j(<div style={styles} ref={selectCursorRef} />))

        this.appendChild(App.createElement('div', {
          style: styles,
          ref: selectCursorRef
        }))
      },
    }

    window.addEventListener('mouseup', (event): void => {
      Object.assign(selectCursorAxis.state, {
        x: 0,
        y: 0
      })

      selectableDataObject.selectionIteration = []

      if (selectCursorRef.current) {
        try {
          selectAreaElement.removeChild(selectCursorRef.current)
        } catch (err) {
          return
        }
      }
    })

    window.addEventListener('mousemove', (event): void => {
      if (!(selectCursorRef.current && selectCursorRef.current.parentNode)) {
        return
      }

      const getCords = (): Cords => {
        const cords: Cords = {
          x: 0,
          y: 0,
          height: 0,
          width: 0
        }

        cords.x = selectCursorAxis.state.x
        cords.y = selectCursorAxis.state.y

        const changeWidth = (width: number): void => {
          cords.width = width
        }

        changeWidth(event.clientX - cords.x)
        cords.height = event.clientY - cords.y

        if (event.clientX <= selectCursorAxis.state.x) {
          changeWidth(selectCursorAxis.state.x - event.clientX)

          cords.x -= cords.width
        }

        if (event.clientY <= selectCursorAxis.state.y) {
          cords.height = selectCursorAxis.state.y - event.clientY

          cords.y -= cords.height
        }

        return cords
      }

      const { width, height, x, y } = getCords()

      Object.assign(selectCursorRef.current.style, {
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`
      })

      markReachedElements.apply(selectAreaElement, [event, false])
    })

    window.addEventListener('mousedown', (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement
      const targetElementAttributes = targetElement.getAttributeNames()
      const clickedInASelectAreaButton = selectableDataObject.isAreaSelectButton(targetElement)

      if (!(targetElementAttributes.includes('data-selectable-element-cover')
        || targetElementAttributes.includes('data-selectable-element-cover-check'))) {
        if (!(event.shiftKey || event.ctrlKey)) {
          setTimeout(() => deselectAllElements(), clickedInASelectAreaButton ? 100 : 0)
        }
      }
    })

    for (const eventName in selectAreaElementHandlers) {
      const selectAreaElementHandler = selectAreaElementHandlers[eventName]
      selectAreaElement.addEventListener(eventName as keyof HTMLElementEventMap, function (this: HTMLElement, event) {
        if (event instanceof MouseEvent) {
          selectAreaElementHandler.apply(this, [event])
        }
      })
    }
  }
}
