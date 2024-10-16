import { CSSProperties } from "react"
import { elementCords, elementOffsetWidth, generateUniqueId, j, orderNumbers } from "."
import { getDraggingElementContainer, isDraggableElement } from "./setups/setDragAreaElementsUp"
import { createInlineStyles } from "./styled/createStyles"

export type DragCursorProps = {
  element: HTMLElement
}

export type GlobalDraggableElementsStore = {
  [key: string]: {
    tabIndex: number
    parentNode: HTMLElement
    nextNode: HTMLElement
  }
}

const kState = Symbol('state')

export type DragCursor = {
  append(element: HTMLElement): void
  move(event: MouseEvent): void
  clear(): void
  render(): void
  getState(): DragCursorState
  hasDropTarget(): boolean
  reorderElements(): void

  store: Array<HTMLElement>
  [kState]: DragCursorState
}

export type DragCursorStore = {
  [key: string]: DragCursor
}

export type DragCursorState = Partial<{
  targetElement: HTMLElement
  settingOrder: 'before' | 'last'
}>

const dragCursorStore: DragCursorStore = {}
const globalDraggableElementsStore: GlobalDraggableElementsStore = {}

const getDragCursorElement = (width: number, dragAreaElement: HTMLElement): HTMLElement => {
  const currentDragCursorElement = dragAreaElement.querySelector<HTMLDivElement>(`[data-drag-cursor-element]`)

  if (currentDragCursorElement) {
    currentDragCursorElement.style.width = `${width}px`
    return currentDragCursorElement
  }

  // const styles: CSSProperties = {
  //   width: `${width}px`,
  //   height: 'auto',
  //   position: 'fixed',
  //   zIndex: '2000'
  // }

  const dragCursorElementId = generateUniqueId()

  const element = document.createElement('div')

  element.style.cssText = createInlineStyles({
    width: `${width}px`,
    height: 'auto',
    position: 'fixed',
    zIndex: '2000'
  })

  element.setAttribute('data-drag-cursor-element', dragCursorElementId)

  return element
}

const getDragCursorElementId = (dragCursorElement: HTMLElement): string => {
  return String(dragCursorElement.getAttribute('data-drag-cursor-element'))
}

const getDraggableElementId = (draggableElement: HTMLElement): string => {
  const draggableElementId = draggableElement.getAttribute('data-draggable-id')
  return String(draggableElementId || '')
}

const getElementChildren = (element: HTMLElement): Array<HTMLElement> => {
  return Array.from(element.children)
    .map<HTMLElement>(child => child as HTMLElement)
}

const orderDragCursorChildren = (children: Array<Element>): Array<Element> => {
  const store: { [key: number]: Element } = {}

  const childrenTabIndexes = children.map<number>(child => {
    const draggableElementId = String(child.getAttribute('data-draggable-id'))
    const draggableElementData = globalDraggableElementsStore[draggableElementId]

    // console.log('>>> draggableElementData.tabIndex >>> ', draggableElementData.tabIndex)

    store[draggableElementData.tabIndex] = child

    return draggableElementData.tabIndex
  })


  // console.log('childrenTabIndexes => ', childrenTabIndexes)
  const orderedChildrenTabIndexes = orderNumbers(childrenTabIndexes)
  // console.log('orderedChildrenTabIndexes => ', orderedChildrenTabIndexes)

  return orderedChildrenTabIndexes
    .map<Element>(tabIndex => store[tabIndex])
    .reverse()
}

export const getDragCursor = ({ element }: DragCursorProps): DragCursor => {
  const width = elementOffsetWidth(element)
  const dragCursorElement = getDragCursorElement(width, getDraggingElementContainer(getDraggableElementId(element)))

  if (element.parentNode && !element.parentNode.contains(dragCursorElement)) {
    element.parentNode.appendChild(dragCursorElement)
  }

  const dragCursorElementId = getDragCursorElementId(dragCursorElement)

  dragCursorStore[dragCursorElementId] = dragCursorStore[dragCursorElementId] || {
    store: [],
    [kState]: {},
    /**
     * append a new element to the cursor
     * 
     * @param draggableElement draggable element object
     */
    append(draggableElement) {

      const draggableElementParent = draggableElement.parentNode as HTMLElement

      if (draggableElementParent) {
        const draggableElementParentNodeChildren = Array.from(draggableElementParent.children)
        const draggableElementTabIndex = draggableElementParentNodeChildren.indexOf(draggableElement)
        const draggableElementId = String(draggableElement.getAttribute('data-draggable-id'))

        const elementAfterDraggableElement = draggableElementParentNodeChildren[
          draggableElementTabIndex + 1
        ]

        globalDraggableElementsStore[draggableElementId] = globalDraggableElementsStore[draggableElementId] || {
          tabIndex: Number(draggableElementTabIndex),
          parentNode: draggableElementParent,
          nextNode: elementAfterDraggableElement
        }

        // console.log('El => ', globalDraggableElementsStore[draggableElementId])

        this.store.push(draggableElement)
      }
    },

    move(event) {
      Object.assign(dragCursorElement.style, {
        top: `${event.clientY}px`,
        left: `${event.clientX - (width / 2)}px`,
      })

      // if (this.store.length < 1) {
      this.render()
      // }

      // const [firstDraggingElement] = getElementChildren(dragCursorElement)
      // const dragAreaChildren = getElementChildren(dragCursorElement.parentNode as HTMLElement)

      // if (firstDraggingElement) {
      //   const firstDraggingElementCords = elementCords(firstDraggingElement)
      //   // console.log({ firstDraggingElement })

      //   for (const dragAreaChild of dragAreaChildren) {
      //     const dragAreaChildCords = elementCords(dragAreaChild)

      //     // console.log(dragAreaChildCords)
      //     /**
      //      * Y
      //      */
      //     if (firstDraggingElementCords.y >= dragAreaChildCords.y
      //       && dragAreaChildCords.yz >= firstDraggingElementCords.yz) {
      //       this[kState].targetElement = dragAreaChild
      //       this[kState].settingOrder = 'after'

      //       // console.log('D1')
      //       continue
      //     }

      //     if (firstDraggingElementCords.y <= dragAreaChildCords.y
      //       && firstDraggingElementCords.yz >= dragAreaChildCords.yz) {
      //       this[kState].targetElement = dragAreaChild
      //       this[kState].settingOrder = 'before'

      //       // console.log('D2')
      //       continue
      //     }

      //     this[kState].targetElement = undefined
      //     this[kState].settingOrder = undefined
      //   }
      // }
    },

    getState() {
      return { ...this[kState] }
    },

    hasDropTarget() {
      const [firstDraggingElement] = getElementChildren(dragCursorElement)
      const dragAreaChildren = getElementChildren(dragCursorElement.parentNode as HTMLElement)
        .filter(dragAreaChild => {
          return isDraggableElement(dragAreaChild, dragCursorElement.parentNode as HTMLElement)
        })

      // console.log({
      //   firstId: getDraggableElementId(firstDraggingElement),
      //   dragAreaChildren: dragAreaChildren.map(dragAreaChild => (
      //     getDraggableElementId(dragAreaChild)
      //   ))
      // })

      if (firstDraggingElement) {
        const firstDraggingElementCords = elementCords(firstDraggingElement)
        // console.log({ firstDraggingElement })

        for (const dragAreaChild of dragAreaChildren) {
          const dragAreaChildCords = elementCords(dragAreaChild)

          // console.log(dragAreaChildCords)
          /**
           * Y
           */
          if (firstDraggingElementCords.y >= dragAreaChildCords.y
            && firstDraggingElementCords.yz >= dragAreaChildCords.yz
            && firstDraggingElementCords.y <= (dragAreaChildCords.yz + 10)) {

            const dragAreaNextChild = dragAreaChildren[
              +1 + dragAreaChildren.indexOf(dragAreaChild)
            ]

            if (dragAreaNextChild) {
              this[kState].targetElement = dragAreaNextChild
              this[kState].settingOrder = 'before'
              break
            }

            this[kState].targetElement = dragAreaChild
            this[kState].settingOrder = 'last'
            break
          }

          /// (firstDraggingElementCords.yz - dragAreaChildCords.yz) <= dragAreaChildCords.height

          if (firstDraggingElementCords.y <= dragAreaChildCords.y
            && firstDraggingElementCords.yz < dragAreaChildCords.yz
            && firstDraggingElementCords.yz >= (dragAreaChildCords.y - 10)) {
            this[kState].targetElement = dragAreaChild
            this[kState].settingOrder = 'before'
            break
          }

          this[kState].targetElement = undefined
          this[kState].settingOrder = undefined
        }
      }

      return (this[kState].targetElement instanceof HTMLElement)
    },

    clear() {

      if (this.hasDropTarget()) {
        const state = this.getState()
        const dragAreaElement = dragCursorElement.parentNode as HTMLElement
        const draggingElements = Array.from(dragCursorElement.children)

        for (const draggingElement of draggingElements) {
          switch (state.settingOrder) {
            case 'last':
              dragAreaElement.appendChild(draggingElement)
              break

            case 'before':
              if (state.targetElement) {
                try {
                  dragAreaElement.insertBefore(draggingElement, state.targetElement)
                } catch (err) {
                  dragAreaElement.appendChild(draggingElement)
                }
              }
              break
          }
        }

        const dragAreaDraggableElements = getElementChildren(dragAreaElement)
          .filter(dragAreaChild => {
            return isDraggableElement(dragAreaChild, dragCursorElement.parentNode as HTMLElement)
          })

        dragAreaDraggableElements.forEach((draggableElement, newTabIndex) => {
          const draggableElementId = getDraggableElementId(draggableElement)

          const draggableElementData = globalDraggableElementsStore[draggableElementId]

          if (typeof draggableElementData === 'object') {
            draggableElementData.tabIndex = newTabIndex
            draggableElementData.nextNode = dragAreaDraggableElements[newTabIndex + 1]
          }
        })

        this.store.splice(0, this.store.length)

        return
      }

      this.reorderElements()
    },

    render() {
      /**
       * render each draggable element in the cursor view
       */
      for (const draggableElement of this.store) {
        dragCursorElement.appendChild(draggableElement)
      }
    },

    reorderElements() {
      const dragCursorElementChildren = orderDragCursorChildren(Array.from(dragCursorElement.children))

      for (const dragCursorElementChild of dragCursorElementChildren) {
        /**
         * Replace each element in the original position, 
         * assuming that drag event was canceled
         */
        if (dragCursorElementChild instanceof HTMLElement) {
          const draggableElementId = String(dragCursorElementChild.getAttribute('data-draggable-id'))
          const draggableElementData = globalDraggableElementsStore[draggableElementId]

          if (draggableElementData) {
            // console.log(draggableElementData.tabIndex)

            const elementAfterDraggableElement = draggableElementData.tabIndex === 0
              ? draggableElementData.parentNode.children[0]
              : draggableElementData.nextNode

            if (elementAfterDraggableElement) {
              try {
                draggableElementData.parentNode.insertBefore(dragCursorElementChild, elementAfterDraggableElement)
                continue
              } catch (err) {
                // console.log(err)
              }
            }

            // console.log('????, ', element.parentNode)

            draggableElementData.parentNode.appendChild(dragCursorElementChild)
          }
        }
      }

      this.store.splice(0, this.store.length)
    },
  }

  // const state: DragCursorState = {}

  return dragCursorStore[dragCursorElementId]
}
