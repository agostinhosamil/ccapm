import { ReactElement } from 'react'

export const appendElement = (targetElement: HTMLElement, element: (ReactElement | Node)): void => {
  if (element instanceof Node) {
    targetElement.appendChild(element)
  }
}
