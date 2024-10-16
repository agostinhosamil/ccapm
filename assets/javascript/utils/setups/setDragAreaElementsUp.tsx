import { getDragCursor } from '@utils/dargCursor'
import { selectArea } from '@utils/selectArea'
import { SelectArea } from '@utils/setups/setSelectAreaElementsUp'
import { elementCords, generateUniqueId, getElementJsonAttribute, getElementStyle } from '~/utils'

type MouseEventHandler = (this: HTMLElement, event: MouseEvent) => void
type DraggableElementFactoryProps = {
  id: string
  element: HTMLElement
}

type DraggableElement = {
  id: string
  element: HTMLElement
  dragging: boolean
  touching: boolean
  props: {
    [key: string]: any
  }

  isDragging(this: DraggableElement): boolean
  startDragging(this: DraggableElement): void
  endDragging(this: DraggableElement): void
  isTouching(this: DraggableElement): boolean
  startTouching(this: DraggableElement): void
  endTouching(this: DraggableElement): void
}

const documentElementCursor = getElementStyle(document.documentElement, 'cursor')

const draggableElements: Array<DraggableElement> = []

const dragAreaChildMouseDownHandler: MouseEventHandler = function (): void {
  const elementId = getDraggableElementId(this)
  const draggableElementDataObject = getDraggableElementById(elementId)

  draggableElementDataObject.startTouching()

  setTimeout(() => {
    if (!draggableElementDataObject.isTouching()) {
      return
    }

    draggableElementDataObject.startDragging()
    draggableElementDataObject.endTouching()
    document.documentElement.style.cursor = 'grab'
    // console.log('Touch>>>')
  }, 200)
}

//#region utils

const draggableElementFactory = ({ id, element }: DraggableElementFactoryProps): DraggableElement => ({
  id,
  element,
  dragging: false,
  touching: false,
  props: {},

  isDragging() {
    return this.dragging
  },

  endDragging() {
    this.dragging = false
  },

  startDragging() {
    this.dragging = true
  },

  isTouching() {
    return this.touching
  },

  endTouching() {
    this.touching = false
  },

  startTouching() {
    this.touching = true
  }
})

const setDraggableElementId = (element: HTMLElement): string => {
  const currentElementId = String(element.getAttribute('data-draggable-id'))

  if (!element.hasAttribute('data-draggable')) {
    throw new Error('setDraggableElementId: element is not a draggable element')
  }

  const storeElement = draggableElements.filter(draggableElement => (
    draggableElement.id === currentElementId
  ))

  const elementId = storeElement.length > 0 ? currentElementId : generateUniqueId()

  if (!(storeElement.length > 0)) {
    element.setAttribute('data-draggable-id', elementId)

    draggableElements.push(draggableElementFactory({ id: elementId, element }))
  }

  return elementId
}

export const getDraggableElementId = (element: HTMLElement): string => {
  return setDraggableElementId(element)
}

export const isDraggableElement = (element: HTMLElement, dragAreaElement: HTMLElement): boolean => {
  const currentElementId = String(element.getAttribute('data-draggable-id'))
  const draggableElementKey = element.getAttribute('data-draggable')
  const dragAreaElementKey = getElementJsonAttribute<Array<string> | string>(dragAreaElement, 'data-drag-area') // dragAreaElement.getAttribute('data-drag-area')

  const dragAreaElementKeyList = dragAreaElementKey instanceof Array
    ? dragAreaElementKey
    : [dragAreaElementKey]

  if (!(draggableElementKey && dragAreaElementKey && (dragAreaElementKeyList.includes(draggableElementKey)))) {
    return false
  }

  const storeElement = draggableElements.filter(draggableElement => (
    draggableElement.id === currentElementId
  ))

  return storeElement.length > 0
}

const getDraggableElementById = (elementId: string): DraggableElement => {
  const draggableElement = draggableElements.find(draggableElement => (
    draggableElement.id === elementId
  ))

  if (draggableElement) {
    return draggableElement
  }

  throw new Error('Draggable element not found')
}

const getDragAreaChildren = (dragAreaElement: HTMLElement, childrenTypes: Array<string>): Array<HTMLElement> => {
  const dragAreaElementChildren = Array.from(dragAreaElement.querySelectorAll<HTMLElement>(`[data-draggable]`))

  return dragAreaElementChildren.filter((dragAreaElementChild) => {
    const dragAreaElementChildType = String(dragAreaElementChild.getAttribute('data-draggable'))

    return childrenTypes.includes(dragAreaElementChildType)
  })
}

const getDraggingElement = (): (DraggableElement | undefined) => {
  return draggableElements.find((draggableElement) => (
    draggableElement.dragging
  ))
}

export const getDraggingElementSelectArea = (elementId: string): (SelectArea | undefined) => {
  const draggableElementDataObject = getDraggableElementById(elementId)

  let draggableElementParent = draggableElementDataObject.element.parentNode as HTMLElement

  while (draggableElementParent instanceof HTMLElement) {
    const selectAreaKey = String(draggableElementParent.getAttribute('data-select-area'))

    try {
      return selectArea(selectAreaKey)
    } catch (err) {
      continue
    } finally {
      draggableElementParent = draggableElementParent.parentNode as HTMLElement
    }
  }

  return
}

export const getDraggingElementContainer = (elementId: string): HTMLElement => {
  const draggableElementDataObject = getDraggableElementById(elementId)

  let draggableElementParent = draggableElementDataObject.element.parentNode as HTMLElement

  while (draggableElementParent instanceof HTMLElement) {
    if (isDraggableElement(draggableElementDataObject.element, draggableElementParent)) {
      return draggableElementParent
    }

    draggableElementParent = draggableElementParent.parentNode as HTMLElement
  }

  throw new Error('draggable element parent could not be found')
}

export const getDraggingElementSiblings = (elementId: string): Array<HTMLElement> => {
  const draggingElementContainer = getDraggingElementContainer(elementId)

  const draggingElementContainerChildren = Array.from(draggingElementContainer.children)

  return draggingElementContainerChildren
    .filter((draggingElementContainerChild) => (
      String(draggingElementContainerChild.getAttribute('data-dragging-id')) !== elementId
    ))
    .map<HTMLElement>((draggingElementContainerChild) => {
      return draggingElementContainerChild as HTMLElement
    })
}

//#endregion

export const setDragAreaElementsUp = () => {
  const dragAreaElements = Array.from(document.querySelectorAll<HTMLElement>('[data-drag-area]'))

  for (const dragAreaElement of dragAreaElements) {
    let dragAreaChildrenType = getElementJsonAttribute<Array<string> | string>(dragAreaElement, 'data-drag-area')

    dragAreaChildrenType = dragAreaChildrenType instanceof Array
      ? dragAreaChildrenType
      : [dragAreaChildrenType]

    const dragAreaChildren = getDragAreaChildren(dragAreaElement, dragAreaChildrenType)

    for (const dragAreaChild of dragAreaChildren) {
      setDraggableElementId(dragAreaChild)

      dragAreaChild.removeEventListener('mousedown', dragAreaChildMouseDownHandler, true)
      dragAreaChild.addEventListener('mousedown', dragAreaChildMouseDownHandler, true)
    }
  }
}

window.addEventListener('mouseup', () => {
  document.documentElement.style.cursor = documentElementCursor

  const dragging = getDraggingElement()

  if (dragging) {
    dragging.endDragging()

    const dragCursor = getDragCursor({
      element: dragging.element
    })

    dragCursor.clear()
  }

  draggableElements.forEach((draggableElement) => {
    draggableElement.endDragging()
    draggableElement.endTouching()
  })
})

window.addEventListener('mousemove', (event) => {
  const draggingElement = getDraggingElement()

  if (draggingElement) {
    const draggingElementSelectArea = getDraggingElementSelectArea(draggingElement.id)

    const dragCursor = getDragCursor({
      element: draggingElement.element
    })

    if (draggingElementSelectArea && draggingElementSelectArea.selectedElements.length >= 1) {
      // console.log(draggingElementSelectArea.selectedElements)

      draggingElementSelectArea.selectedElements
        .forEach((selectable) => {
          if (isDraggableElement(selectable.element, draggingElement.element.parentNode as HTMLElement)) {
            dragCursor.append(selectable.element)
          }
        })
    } else {
      dragCursor.append(draggingElement.element)
    }

    dragCursor.move(event)
  }
})
