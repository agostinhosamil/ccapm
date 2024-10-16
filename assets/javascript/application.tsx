import { App } from './App'
import { watchElements } from './utils/watchElements'
import { handleRegisterForm } from './utils/handleRegisterForm'

import { setAreaUploadsElementsUp } from './utils/setups/setAreaUploadsElementsUp'
import * as scrollBottomEventHandlers from './utils/scrollBottomEventHandlers/index'
import { setDropdownLinkElementsUp } from './utils/setups/setDropdownLinkElementsUp'

// pass
import { setDialogBoxLinkElementsUp } from './utils/setups/setDialogBoxLinkElementsUp'
import { setCarouselContainerElementsUp } from './utils/setups/setCarouselContainerElementsUp'
// import { setGalleryGridContainersElementsUp } from './utils/setGalleryGridContainersElementsUp'
import { setTouchableElementsUp } from './utils/setups/setTouchableElementsUp'
import { setLinksElementsUp } from './utils/setups/setLinksElementsUp'
import { setSelectAreaElementsUp } from './utils/setups/setSelectAreaElementsUp'
// import { toast } from './utils'
import { setDragAreaElementsUp } from './utils/setups/setDragAreaElementsUp'
import { isElementChildOf, toast } from './utils'

import { renderNewsFeed } from './hiya/renderNewsFeed'
import { renderPostPage } from './hiya/renderPostPage'
import { renderComposerForm } from './hiya/renderComposerForm'
import { watchPageWindowElement } from './hiya/watchPageWindowElement'
import { updateBottomMenuControl } from './hiya/ui/updateBottomMenuControl'

type ScrollBottomEventHandlers = typeof scrollBottomEventHandlers
// type FormRequestHandlers = typeof formRequestHandlers

App.scope('application', [], function () {
  watchElements([
    setLinksElementsUp,
    setDragAreaElementsUp,
    setTouchableElementsUp,
    setSelectAreaElementsUp,
    setAreaUploadsElementsUp,
    setDropdownLinkElementsUp,
    setDialogBoxLinkElementsUp,
    setCarouselContainerElementsUp,
    // setGalleryGridContainersElementsUp,

    renderComposerForm,
    renderNewsFeed,
    renderPostPage,
    watchPageWindowElement,
    updateBottomMenuControl
  ])

  const registerForm = document.querySelector<HTMLFormElement>('form.register-form')
  // const requestForm = document.querySelector<HTMLFormElement>('form.page-content-body-form')

  if (registerForm) {
    handleRegisterForm(registerForm)
  }

  const flashScriptElement = document.querySelector<HTMLScriptElement>('script[type="application/json"][data-property="application-view-flash"]')

  if (flashScriptElement) {
    try {
      const flashData = JSON.parse(flashScriptElement.innerText)

      if (flashData instanceof Array) {
        for (const flash of flashData) {
          const [flashMessage] = flash

          toast(flashMessage)
        }
      }
    } catch (err) {
      // pass
    }
  }

  const fixPageHeaderIfNotInView = () => {
    const pageHeaderElement = document.querySelector<HTMLElement>('header#page-header')

    const getPageHeaderShadowElement = (): HTMLDivElement => {
      const pageHeaderShadowElement: HTMLDivElement = document.querySelector<HTMLDivElement>('.data-page-header-shadow')
        || document.createElement('div')

      if (!pageHeaderShadowElement.classList.contains('data-page-header-shadow')) {
        pageHeaderShadowElement.classList.add('data-page-header-shadow')
      }

      if (pageHeaderElement) {
        pageHeaderShadowElement.style.height = `${pageHeaderElement.offsetHeight}px`
      }

      return pageHeaderShadowElement
    }

    if (pageHeaderElement instanceof HTMLElement
      && window.scrollY >= (pageHeaderElement.offsetHeight + 10)) {
      pageHeaderElement.classList.add('fixed-header')

      if (pageHeaderElement.parentNode) {
        pageHeaderElement.parentNode.insertBefore(getPageHeaderShadowElement(), pageHeaderElement)
      }
    } else if (pageHeaderElement instanceof HTMLElement) {
      const pageHeaderShadowElement = getPageHeaderShadowElement()

      if (pageHeaderElement.parentNode && isElementChildOf(pageHeaderShadowElement, pageHeaderElement.parentNode as HTMLElement)) {
        pageHeaderElement.parentNode.removeChild(pageHeaderShadowElement)
      }

      pageHeaderElement.classList.remove('fixed-header')
    }
  }

  function windowScrollHandler(_event: Event) {
    if (window.scrollY + window.innerHeight >= window.document.body.scrollHeight) {
      Object.keys(scrollBottomEventHandlers).forEach(key => {
        const scrollBottomEventHandler = scrollBottomEventHandlers[key as keyof ScrollBottomEventHandlers]

        if (typeof scrollBottomEventHandler === 'function') {
          scrollBottomEventHandler()
        }
      })
    }

    fixPageHeaderIfNotInView()
  }

  fixPageHeaderIfNotInView()

  window.addEventListener('scroll', (e: Event) => windowScrollHandler(e))
})
