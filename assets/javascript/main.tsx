import React, { useEffect, useRef, useState } from 'react'

import { App } from './App'
import { Scope } from 'Types/App'
import { render } from './utils/render'
import { HTMLElementObjectRef } from 'Types/Reite'
import { generateUniqueId, noNullHref } from './utils'
import { objectFullMerge } from './utils/objectFullMerge'
import { AsyncElement } from './components/AsyncElement'

type DialogBoxEventHandler = () => void

type DialogBoxProps = {
  close: DialogBoxEventHandler
  onClose: (eventHandler: DialogBoxEventHandler) => void
  on: (eventName: string, eventHandler: DialogBoxEventHandler) => void

  size?: string
  sizes?: string | Array<number>
  href?: string
  dock?: 'center' | 'fill' | 'top' | 'right' | 'bottom' | 'left'
}

type DialogBoxEventHandlerMap = {
  [eventHandlerList: string]: Array<DialogBoxEventHandler>
}

const openedDialogBoxes: Array<HTMLElement> = []

App.scope('main', [], function (this: Scope) {
  this.myName = 'Agostinho Lopes'

  document.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      const openedDialogBox = openedDialogBoxes[-1 + openedDialogBoxes.length]

      if (openedDialogBox instanceof HTMLElement) {
        const openedDialogBoxCloseButton = openedDialogBox.querySelector<HTMLButtonElement>('.app-dialog-box-close-button-container button')

        if (openedDialogBoxCloseButton) {
          openedDialogBoxCloseButton.click()
        }
      }
    }
  })
})

App.define('openDialogBox', function (props: Partial<DialogBoxProps> = {}) {
  // <div class="app-dialog-box-container">
  //   <div class="app-dialog-box">
  //     <img alt="loading" src="./assets/images/loading.gif" >
  //   </div>
  // </div>

  const dialogBoxRef = {}

  const dialogBody = arguments[-1 + arguments.length] || null

  props = props && typeof props === 'object' ? props : {}

  const bodyContainerRef: HTMLElementObjectRef = {}
  const dialogStatusData = {
    closed: false
  }

  const eventHandlers: DialogBoxEventHandlerMap = {
    close: [
      () => {
        if (typeof props.href === 'string'
          && noNullHref(props.href)) {
          window.history.back()
        }
      }
    ]
  }

  const it: DialogBoxProps = {
    close() {
      if (!dialogStatusData.closed) {
        closeDialog()
      }
    },

    onClose(closeEventHandler) {
      eventHandlers.close.push(closeEventHandler)
    },

    on(eventName, eventHandler) {
      if (typeof eventHandlers[eventName] === 'object'
        && eventHandlers[eventName] instanceof Array) {
        eventHandlers[eventName].push(eventHandler)
      }
    }
  }

  function closeDialog() {
    if (dialogStatusData.closed) {
      return
    }

    dialogStatusData.closed = true

    dialogBoxContainerElement.classList.add('hide')

    root.destroy()

    setTimeout(function () {
      const lastOpenedDialogIndex = openedDialogBoxes.indexOf(dialogBoxContainerElement) // -1 + openedDialogBoxes.length

      const lastOpenedDialog = openedDialogBoxes[lastOpenedDialogIndex]

      if (lastOpenedDialog instanceof HTMLElement && lastOpenedDialog.parentNode) {
        lastOpenedDialog.parentNode.removeChild(lastOpenedDialog)
      }

      openedDialogBoxes.splice(lastOpenedDialogIndex, 1)
    }, 100)
  }

  function handleCloseAction() {
    closeDialog()

    eventHandlers.close
      .filter(eventHandler => typeof eventHandler === 'function')
      .forEach(eventHandler => {
        eventHandler()
      })
  }

  const dialogBoxElementClassName: Array<string> = [
    'app-dialog-box-container'
  ]

  if (typeof props.dock === 'string' && props.dock !== 'center') {
    dialogBoxElementClassName.push(`app-dialog-box-dock-${props.dock}`)
  }

  // const DialogBox = App.createElement('div', { 'class': dialogBoxElementClassName.join(' ') },
  //   App.createElement('div', { 'class': 'app-dialog-box' },
  //     App.createElement('div', { 'class': 'app-dialog-box-close-button-container' },
  //       App.createElement('button', { onClick: handleCloseButtonClick },
  //         App.get('closeIcon')
  //       )
  //     ),
  //     App.createElement('div', { 'class': 'app-dialog-box-body', ref: bodyContainerRef },
  //       App.get('LoadingImage')
  //     )
  //   )
  // )

  const dialogBoxId = generateUniqueId()

  const dialogBoxContainerElement = App.createElement('div', {
    ref: dialogBoxRef,
    'data-dialog-box-id': dialogBoxId
  })

  // App.createElement('div', { 
  //   className: dialogBoxElementClassName.join(' ') 
  // },
  //   App.createElement('div', { 
  //     className: 'app-dialog-box', 
  //     ref: dialogBoxRef 
  //   })
  // )

  const DialogBox: React.FunctionComponent = () => {
    const [showDialog, setShowDialog] = useState(true)
    const [bodyContent, setBodyContent] = useState<React.ReactElement | null>(null)

    const bodyContainerRef = useRef<HTMLDivElement>(null)

    const closeButtonClickHandler = () => {
      setShowDialog(false)

      handleCloseAction()
    }

    useEffect(() => {

      const adjustDialogSizes = () => {
        const dialogProps = objectFullMerge(props, it)

        setTimeout(() => {
          const bodyContainerParent = (bodyContainerRef.current instanceof HTMLElement && bodyContainerRef.current.parentNode)
            ? (bodyContainerRef.current.parentNode as HTMLElement)
            : null

          if (validSize(dialogProps.size) && bodyContainerParent) {
            bodyContainerParent.classList.add(String(dialogProps.size))
          }

          const dialogSizes = readDialogSizes(dialogProps)

          if (dialogSizes && bodyContainerParent) {
            const [width, height] = dialogSizes

            bodyContainerParent.style.cssText = String(
              `max-width: ${width}px; max-height: ${height}px; width: ${width}px; height: ${height}px;`
            )
          }

          // if (bodyContainerRef.current) {
          //   bodyContainerRef.current.innerHTML = ''

          //   setTimeout(function () {
          //     bodyContainerRef.current?.appendChild(_dialogBody)
          //   }, 500);
          // }
        }, 10)
      }

      /**
       * set dialog body content from the dialogBody argument
       * which should be a valid react node or a function component
       */
      ((async () => {
        let dialogBodyContent: any = null

        if (typeof dialogBody === 'function') {
          dialogBodyContent = React.createElement(AsyncElement, {
            element: dialogBody,
            fallback: () => (
              <img alt="Loading..." src={loadingImageUrl} />
            )
          }) // dialogBody()

          adjustDialogSizes()

          return setTimeout(function () {
            setBodyContent(dialogBodyContent)
          }, 500)
        }

        if (!dialogBody) {
          return closeDialog()
        }

        adjustDialogSizes()

        return setTimeout(function () {
          setBodyContent(dialogBodyContent)
        }, 500)
      })())
    }, [])

    if (!showDialog) {
      return null
    }

    const closeIconUrl: string = App.get<string>('closeIconUrl')
    const loadingImageUrl: string = App.get<string>('loadingImageUrl')

    return (
      <div className={dialogBoxElementClassName.join(' ')}>
        <div className="app-dialog-box">
          <div className="app-dialog-box-close-button-container">
            <button onClick={closeButtonClickHandler}>
              <img alt="Close Dialog" src={closeIconUrl} />
            </button>
          </div>
          <div className="app-dialog-box-body" ref={bodyContainerRef}>
            {bodyContent && bodyContent || (
              <img alt="Loading..." src={loadingImageUrl} />
            )}
          </div>
        </div>
      </div>
    )
  }

  document.body.appendChild(dialogBoxContainerElement)

  openedDialogBoxes.push(dialogBoxContainerElement)

  const root = render(`dialog-box-${dialogBoxId}`, dialogBoxContainerElement, () => <DialogBox />)

  const validSizes = [
    'small',
    'medium',
    'large',
    'x-large',
    'xx-large'
  ]

  const validSize = (size: any) => Boolean(
    typeof size === 'string'
    && /\S/.test(size)
    && validSizes.indexOf(size) >= 0
  )

  const readDialogSizes = (dialogProps: Partial<DialogBoxProps>) => {
    const sizeFilter = (size: any) => (!isNaN(size))

    if (typeof dialogProps.sizes === 'string') {
      dialogProps.sizes = dialogProps.sizes.split('x')
        .filter(sizeFilter)
        .map<number>(data => Number(data))
    }

    if (!(dialogProps.sizes instanceof Array)) {
      return null
    }

    const sizes = dialogProps.sizes.filter(sizeFilter)

    if (sizes.length >= 1) {
      return [Number(sizes[0]), Number(sizes[1] || sizes[0])]
    }
  }

  /* function renderDialogBody(_dialogBody: HTMLElement) {
    if (bodyContainerRef.current) {

      const dialogProps = objectFullMerge(props, it)

      setTimeout(function () {

        const bodyContainerParent = (bodyContainerRef.current instanceof HTMLElement && bodyContainerRef.current.parentNode)
          ? (bodyContainerRef.current.parentNode as HTMLElement)
          : null

        if (validSize(dialogProps.size) && bodyContainerParent) {
          bodyContainerParent.classList.add(String(dialogProps.size))
        }

        const dialogSizes = readDialogSizes(dialogProps)

        if (dialogSizes && bodyContainerParent) {
          const [width, height] = dialogSizes

          bodyContainerParent.style.cssText = String(
            `max-width: ${width}px; max-height: ${height}px; width: ${width}px; height: ${height}px;`
          )
        }

        if (bodyContainerRef.current) {
          bodyContainerRef.current.innerHTML = ''

          setTimeout(function () {
            bodyContainerRef.current?.appendChild(_dialogBody)
          }, 500);
        }
      }, 10)

    }
  } */

  // function closeDialog() {
  //   throw new Error('Dialog body must to be a valid html element or function returning one')
  // }

  // if ('function' === typeof dialogBody) {
  //   const dialogBodyFuncReturningData = dialogBody.apply(it, [props])

  //   if (dialogBodyFuncReturningData instanceof Promise) {
  //     return dialogBodyFuncReturningData.then(function (data) {
  //       if (data instanceof HTMLElement) {
  //         // return renderDialogBody(data)
  //       }

  //       closeDialog()
  //     })
  //   } else if (dialogBodyFuncReturningData instanceof HTMLElement) {
  //     // return renderDialogBody(dialogBodyFuncReturningData)
  //   }

  // } else if (dialogBody instanceof HTMLElement) {
  //   // return renderDialogBody(dialogBody)
  // }

  // if (!(dialogBody instanceof HTMLElement)) {
  //   closeDialog()
  // }
})

App.define('swipeFromLeft', function () {
  const pageMainAside = document.querySelector<HTMLDivElement>('.page-content-aside')

  if (!(pageMainAside instanceof HTMLDivElement)) {
    return
  }

  pageMainAside.tabIndex = 1

  if (pageMainAside && window.innerWidth <= 1100) {
    pageMainAside.focus()
    pageMainAside.classList.add('show')
  }

  function pageMainAsideBlurHandler() {
    if (!(pageMainAside instanceof HTMLDivElement)) {
      return
    }

    pageMainAside.classList.remove('show')
    pageMainAside.removeEventListener('blur', pageMainAsideBlurHandler, true)
  }

  pageMainAside.addEventListener('blur', pageMainAsideBlurHandler, true)
  // console.log('Arrastando a tela... | ' + Math.random())
})

App.scope('pageMainAsideSwiper', [], function () {
  const mouseState = {
    holding: false,
    locked: false
  }

  window.addEventListener('mousedown', function (e) {
    const x = e.clientX
    const pageWidthThird = 0.3 * window.innerWidth

    if (x < pageWidthThird) {
      mouseState.holding = true
    }
  })

  window.addEventListener('mouseup', function () {
    mouseState.holding = !true
    mouseState.locked = false
  })

  window.addEventListener('mousemove', function (e) {
    if (mouseState.holding) {

      const x = e.clientX
      const pageWidthThird = 0.3 * window.innerWidth

      if (x >= pageWidthThird && !mouseState.locked) {
        mouseState.locked = true
        App.call('swipeFromLeft', [])
      }
    }
  })
})
