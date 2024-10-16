import { App } from "~/App"
import { j, noEmpty } from "."
import styled from "./styled/styled"
import { TextArgumentsList, text } from "./text"

const TOASTS_SPACING = 12
const toastStack: Array<HTMLElement> = []

const getToastStackElementY = (): number => {
  const toastElementsTotalHeight: number = toastStack.length <= 0
    ? 0
    : toastStack.map<number>(element => element.offsetHeight)
      .reduce((prev, current) => prev + current)

  return 50 + (toastElementsTotalHeight + (TOASTS_SPACING * toastStack.length))
}

const updateToastsPosition = () => {
  let y = 50

  for (const toastElement of toastStack) {
    toastElement.style.bottom = `${y}px`

    y += toastElement.offsetHeight + TOASTS_SPACING
  }
}

export const toast = (toastText: string, ...args: TextArgumentsList): void => {
  const translatedText = text(toastText, ...args)
  const textContext = noEmpty(translatedText)
    ? translatedText
    : toastText

  const toastDurationInSeconds = 4

  const lastToastElementY = getToastStackElementY()

  const ToastElement = styled.div({
    position: 'fixed',
    bottom: `${lastToastElementY}px`,
    right: '50px',
    backgroundColor: 'rgb(0 0 0 / 93%)',
    display: 'flex',
    flexDirection: 'row',
    padding: '15px 30px',
    borderRadius: '11px',
    maxWidth: '350px',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    zIndex: '2000',
    transition: 'bottom 1.2s ease',
    animation: 'slideFromBottom .7s ease',

    '@media (max-width: 650px)': {
      left: '0px',
      right: '0px',
      margin: 'auto'
    },

    '@media (max-width: 230px)': {
      maxWidth: '96%'
    },

    '@keyframes slideFromBottom': {
      'from': {
        bottom: '-100%'
      },

      'to': {
        bottom: '50px'
      }
    },

    strong: {
      width: '100%',
      display: 'inline-flex',
      fontWeight: '700',
      color: '#ffffff',
      paddingRight: '15px'
    },

    button: {
      border: '0px',
      backgroundColor: 'transparent',
      color: '#ffffff',
      cursor: 'pointer',
      fontWeight: '800'
    }
  })

  const buttonClickHandler = () => {
    try {
      document.body.removeChild(toastElement)

      const toastElementIndex = toastStack.indexOf(toastElement)

      if (toastElementIndex >= 0) {
        toastStack.splice(toastElementIndex, 1)
      }

      updateToastsPosition()
    } catch (err) {
      return
    }
  }

  const toastElement = App.createElement(ToastElement, {},
    App.createElement('strong', {}, textContext),
    App.createElement('button', {
      onClick: buttonClickHandler
    },
      'X'
    )
  )

  // j(
  //   <ToastElement>
  //     <strong>{textContext}</strong>
  //     <button onClick={buttonClickHandler}>X</button>
  //   </ToastElement>
  // )

  document.body.appendChild(toastElement)

  toastStack.push(toastElement)

  setTimeout(buttonClickHandler, 1000 * toastDurationInSeconds)
}
