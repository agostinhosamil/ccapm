import { noEmpty } from ".."

export const setTouchableElementsUp = () => {
  const dataTouchableElements = document.querySelectorAll<HTMLElement>('[data-touchable]')

  for (let i = 0; i < dataTouchableElements.length; i++) {
    const dataTouchableElement = dataTouchableElements[i]
    const dataTouchableElementConfig = {
      letOnBlur: true
    }

    const dataTouchableElementId = dataTouchableElement.getAttribute('data-touchable-element-id')

    if (noEmpty(dataTouchableElementId)) {
      continue
    }

    dataTouchableElement.tabIndex = Math.random()
    dataTouchableElement.setAttribute('data-touchable-element-id', `element:${Math.random()}`)

    dataTouchableElement.addEventListener('mouseenter', () => {
      dataTouchableElementConfig.letOnBlur = false
    })

    dataTouchableElement.addEventListener('mouseleave', () => {
      dataTouchableElementConfig.letOnBlur = true
    })

    dataTouchableElement.addEventListener('focus', () => {
      dataTouchableElement.classList.add('touched')
    })

    dataTouchableElement.addEventListener('blur', () => {
      if (dataTouchableElementConfig.letOnBlur) {
        dataTouchableElement.classList.remove('touched')

        return
      }

      dataTouchableElement.focus()
    })
  }
}
