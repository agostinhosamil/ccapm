import React, { useCallback, useEffect, useRef, useState } from 'react'

import { render, storedRoot } from '@utils/render'
import { ScrollView } from '~/components/ScrollView'
import * as appDropdowns from '~/components/dropdowns'
import { capitalize, elementCords, elementOffsetHeight, elementOffsetY, generateUniqueId, j, lcFirst, noEmpty } from '~/utils'

import {
  DropdownButtonElement,
  DropdownBody,
  DropdownProps,
  DropdownConfig,
  DropdownContentProps,
  DataDropdownMenuProps
} from 'Types/Dropdown'
import { App } from '~/App'
import { createInlineStyles } from '../styled/createStyles'
import { AsyncElement } from '~/components/AsyncElement'

function configDropdown(buttonElement: DropdownButtonElement, dropdownProps: DropdownProps, dropdownBody?: DropdownBody): void {

  const dropdownConfig: DropdownConfig = {
    hideOnBlur: true
  }

  const DropdownContent = ({ children, buttonElement, ...props }: DropdownContentProps) => {
    const contentWrapperDivRef = useRef<HTMLDivElement>(null)
    const contentWrapperContainerDivRef = useRef<HTMLDivElement>(null)
    const dropdownContainerRef = useRef<HTMLDivElement>(null)
    const titleContainerRef = useRef<HTMLDivElement>(null)

    const [bodyContent, setBodyContent] = useState<React.ReactElement | null>(null)
    const [showDropdown, setShowDropdown] = useState<boolean>(true)
    const [buttonElementEventHandled, setButtonElementEventHandled] = useState<boolean>(false)

    useEffect(() => {
      const buttonElementClickHandler = () => {
        setShowDropdown((showDropdown) => !showDropdown)
      }

      if (!buttonElementEventHandled) {
        buttonElement.addEventListener('click', () => buttonElementClickHandler())

        buttonElement.addEventListener('blur', function buttonElementBlurHandler(event) {
          if (dropdownConfig.hideOnBlur) {
            // buttonElement.classList.remove('active')
            setShowDropdown(false)
            return
          }

          buttonElement.focus()
        })

        buttonElement.addEventListener('keydown', function buttonElementKeyDownHandler(event) {
          if (/escape/i.test((event as KeyboardEvent).key)) {
            // buttonElement.classList.remove('active')
            setShowDropdown(false)
            return
          }
        })
      }

      setButtonElementEventHandled(true)
    }, [])

    useEffect(() => {
      if (showDropdown) {
        return buttonElement.classList.add('active')
      }

      buttonElement.classList.remove('active')
    }, [showDropdown])

    const containerRef = (container: HTMLDivElement) => {
      Object.assign(dropdownContainerRef, { current: container })

      const width = Number(dropdownProps.width)
      const pageWidth = document.documentElement.offsetWidth

      if (!container) {
        return
      }

      if (!isNaN(width)) {
        container.style.width = `${width >= pageWidth ? pageWidth : width}px`
      }

      const { y, yz, x, ...cords } = elementCords(container)

      if (yz >= window.innerHeight) {
        const height = window.innerHeight - (y + 50)

        if (cords.height < y) {
          container.classList.add('top-box')
          return
        }

        const titleContainerHeight = elementOffsetHeight(titleContainerRef.current)

        // container.style.cssText += createInlineStyles({
        //   height: `${height}px`,
        //   overflow: 'hidden'
        // })
        container.style.overflow = 'hidden'
        container.style.height = `${height}px`

        if (contentWrapperDivRef.current) {
          contentWrapperDivRef.current.style.height = `${height - (titleContainerHeight + 70)}px`
        }
      }

      if (x < 0) {
        container.style.marginRight = `-${x * (-1)}px`
      }

      const updatedCords = elementCords(container)

      if (updatedCords.xz < pageWidth) {
        const containerXZToPageDiff = pageWidth - updatedCords.xz
        const containerWidthFortyPercent = cords.width * 0.4

        if (containerXZToPageDiff <= containerWidthFortyPercent) {
          const containerMarginRight = parseFloat(container.style.marginRight)
          const containerMarginRightValue = isNaN(containerMarginRight) ? 0 : (
            containerMarginRight > 0 ? containerMarginRight : -1 * containerMarginRight
          )

          container.style.marginRight = `-${containerXZToPageDiff + containerMarginRightValue}px`
        }
      }
    }

    const appendDropdownBodyContent = useCallback((dropdownBodyContent: React.ReactElement) => {
      if (dropdownBodyContent && typeof dropdownBodyContent === 'object') {
        // content.innerHTML = ''
        // content.appendChild(dropdownBodyContent)

        setBodyContent(dropdownBodyContent)

        /* setTimeout(() => {

          if (!content) {
            return
          }

          const dropdownContainerOffsetY = elementOffsetY(dropdownContainerRef.current)
          const dropdownContainerPaddingTop = dropdownContainerRef.current
            ? window.getComputedStyle(dropdownContainerRef.current).paddingTop
            : '0'
          const dropdownContainerPaddings = (parseFloat(dropdownContainerPaddingTop) * 2)
          let dropdownContainerReferenceHeight = content.offsetHeight + dropdownContainerPaddings
          let newDropdownContentWrapperHeightDiff = 0
          // console.log(content.offsetHeight)
          // console.log(content, dropdownContainerRef.current.offsetHeight)
          // console.log('dropdownContainerOffsetY>>>', dropdownContainerRef, '\nValue => ', dropdownContainerOffsetY)

          if ((window.innerHeight - dropdownContainerOffsetY) < content.offsetHeight) {
            dropdownContainerReferenceHeight = (window.innerHeight - dropdownContainerOffsetY) - 10

            if (titleContainerRef.current) {
              newDropdownContentWrapperHeightDiff = (titleContainerRef.current.offsetHeight)
            }
          }

          let newDropdownContainerHeight = dropdownContainerReferenceHeight
          let newDropdownContentWrapperHeight = (newDropdownContainerHeight - dropdownContainerPaddings)

          if (titleContainerRef.current) {
            if (!((window.innerHeight - dropdownContainerOffsetY) < content.offsetHeight)) {
              newDropdownContainerHeight += (titleContainerRef.current.offsetHeight)
            }
            newDropdownContentWrapperHeight -= newDropdownContentWrapperHeightDiff
          }

          // console.log({ newDropdownContainerHeight, newDropdownContentWrapperHeight })
          if (dropdownContainerRef.current && contentWrapperDivRef.current && contentWrapperContainerDivRef.current) {
            dropdownContainerRef.current.style.height = `${newDropdownContainerHeight}px`
            contentWrapperDivRef.current.style.height = `${newDropdownContentWrapperHeight}px`
            contentWrapperContainerDivRef.current.style.height = `${newDropdownContentWrapperHeight}px`
          }

          // dropdownContainerRef.current.removeAttribute('style')
          return
        }, 50) */
      }
    }, [])

    const contentDivRef = useCallback((content: HTMLDivElement) => {
      if (typeof dropdownBody === 'function') {
        // const dropdownBodyContent = dropdownBody.apply(dropdownProps, [dropdownProps])

        // if (dropdownBodyContent instanceof Promise) {
        //   dropdownBodyContent.then((dropdownBodyContent): void => {
        //     appendDropdownBodyContent(dropdownBodyContent)
        //   })
        // } else {
        //   setTimeout(() => appendDropdownBodyContent(dropdownBodyContent), 100)
        // }
        const dropdownBodyContent = React.createElement(AsyncElement, {
          ...dropdownProps,
          element: dropdownBody.bind(dropdownProps),
          fallback: () => (
            <img src={loadingImage} alt="Loading..." />
          )
        })

        appendDropdownBodyContent(dropdownBodyContent)
      }
    }, [])

    const mouseEnterHandler = () => {
      dropdownConfig.hideOnBlur = false
    }

    const mouseLeaveHandler = () => {
      dropdownConfig.hideOnBlur = true
    }

    if (!showDropdown) {
      return null
    }

    const loadingImage = App.get<string>('loadingImageUrl')

    return (
      <div className="data-dropdown-box-container"
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        ref={containerRef}>
        <div className="data-dropdown-box-body">
          {noEmpty(props.title) && (
            <div className="data-dropdown-box-title-container" ref={titleContainerRef}>
              <h5>
                {props.title}
              </h5>
            </div>
          )}
          <div className="data-dropdown-box-content-wrapper" ref={contentWrapperDivRef}>
            <div className="data-dropdown-box-content-wrapper-container" ref={contentWrapperContainerDivRef}>
              <ScrollView>
                <div className="data-dropdown-box-content" ref={contentDivRef}>
                  {bodyContent && bodyContent || <img src={loadingImage} alt="Loading..." />}
                </div>
              </ScrollView>
            </div>
          </div>
        </div>
      </div>
    )
  }

  buttonElement.tabIndex = Math.round(Math.random() * Object.keys({ ...window }).length)

  const dropdownContainer = (buttonElement.parentNode as HTMLElement) || buttonElement

  const dropdownRootRendered = (id: string): boolean => storedRoot(`data-dropdown-menu-${id}`)
  // {
  //   // const currentDropdownContent = dropdownContainer.querySelector('div.data-dropdown-box-container')

  //   // if (currentDropdownContent) {
  //   //   dropdownContainer.removeChild(currentDropdownContent)
  //   //   return true;
  //   // }

  //   return storedRoot('data-dropdown-menu')

  //   // if (root) {
  //   //   // root.destroy()
  //   //   return true
  //   // }

  //   // return false
  // }

  // buttonElement.addEventListener('blur', function buttonElementBlurHandler(event) {
  //   const element = event.target as HTMLElement

  //   if (dropdownConfig.hideOnBlur && element) {
  //     element.classList.remove('active')
  //     dropdownRootRendered()
  //     return
  //   }

  //   element.focus()
  // })

  // buttonElement.addEventListener('keydown', function buttonElementKeyDownHandler(event) {
  //   const element = event.target as HTMLElement

  //   if (/escape/i.test((event as KeyboardEvent).key)) {
  //     element.classList.remove('active')
  //     dropdownRootRendered()
  //     return
  //   }
  // })

  buttonElement.addEventListener('click', (event) => {
    event.preventDefault()

    const currentDropdownId = String(buttonElement.getAttribute('data-dropdown-id'))

    if (dropdownRootRendered(currentDropdownId)) {
      return
    }

    dropdownContainer.style.cssText = 'position: relative;'

    const dataDropdownId = generateUniqueId()

    const dropdownWrapper = document.createElement('div')

    buttonElement.setAttribute('data-dropdown-id', dataDropdownId)

    dropdownContainer.appendChild(dropdownWrapper)

    render(`data-dropdown-menu-${dataDropdownId}`, dropdownWrapper, () => {
      return (
        <DropdownContent
          {...dropdownProps}
          buttonElement={buttonElement} />
      )
    })
  })
}

export function setDropdownLinkElementsUp() {
  const dropdownLinkElements = document.querySelectorAll('[data-dropdown-menu]')

  if (!(appDropdowns instanceof Object && appDropdowns)) {
    return
  }

  Array.from(dropdownLinkElements).forEach((dropdownLinkElement) => {
    if (typeof dropdownLinkElement['dialogBoxSet' as keyof Element] !== typeof undefined) {
      return
    }

    Object.defineProperty(dropdownLinkElement, 'dialogBoxSet', {
      value: true
    })

    const camel = (str: string) => typeof 'str' === typeof str && (
      str.split(/\-+/).map(word => capitalize(word)).join('')
    )

    const dataDropdownMenuProps: DataDropdownMenuProps = {}
    const size = String(dropdownLinkElement.getAttribute('data-dropdown-size'))
    const dataDropdownMenu = dropdownLinkElement.getAttribute('data-dropdown-menu')

    const dataDropdownMenuPropName = camel(String(dataDropdownMenu))

    dropdownLinkElement.getAttributeNames()
      .forEach(attributeName => {
        if (/^data-dropdown-(.+)/i.test(attributeName)) {
          let dataDropdownMenuPropKey = camel(attributeName.replace(/^data-dropdown-/i, ''))

          dataDropdownMenuPropKey = lcFirst(String(dataDropdownMenuPropKey))
          let attributeValue = String(dropdownLinkElement.getAttribute(attributeName))

          try {
            attributeValue = JSON.parse(attributeValue)
          } catch (err) { }

          dataDropdownMenuProps[dataDropdownMenuPropKey] = attributeValue
        }
      })

    const appDropdown = appDropdowns[dataDropdownMenuPropName as keyof (typeof appDropdowns)]

    if (dataDropdownMenuPropName && typeof appDropdown === 'function') {
      configDropdown(dropdownLinkElement as DropdownButtonElement, { size, ...dataDropdownMenuProps }, appDropdown as DropdownBody)
    }
  })
}
