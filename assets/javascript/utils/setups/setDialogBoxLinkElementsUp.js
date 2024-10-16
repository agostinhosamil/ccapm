import { App } from '~/App'
import * as appDialogViews from '~/components/dialogs/index'
import { noNullHref } from '..'

export function setDialogBoxLinkElementsUp() {
  const dialogBoxLinkElements = document.querySelectorAll('[data-dialog-box]')

  if (!(appDialogViews instanceof Object)) {
    return
  }

  Array.from(dialogBoxLinkElements).forEach(dialogBoxLinkElement => {
    if (dialogBoxLinkElement.dialogBoxSet) {
      return
    }

    dialogBoxLinkElement.dialogBoxSet = true

    dialogBoxLinkElement.addEventListener('click', event => {
      // event.stopPropagation()

      const capitalize = word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
      const camel = str => typeof 'str' === typeof str && str.split(/\-+/).map(word => capitalize(word)).join('')

      const dataDialogBoxProps = {}
      const slashRe = /(\/+)/
      const size = event.target.getAttribute('data-dialog-size')
      const dataDialogBox = event.target.getAttribute('data-dialog-box')

      const href = event.target.getAttribute('href')

      let dataDialogBoxPropName = null
      let appDialogViewsObjectRef = appDialogViews

      const dataDialogBoxPropSlices = dataDialogBox.split(slashRe).filter(slice => !slashRe.test(slice))

      for (const dataDialogBoxPropSlice of dataDialogBoxPropSlices) {
        dataDialogBoxPropName = camel(dataDialogBoxPropSlice)

        if (appDialogViewsObjectRef[dataDialogBoxPropName] && typeof appDialogViewsObjectRef[dataDialogBoxPropName] === 'object') {
          appDialogViewsObjectRef = appDialogViewsObjectRef[dataDialogBoxPropName]
        }
      }

      event.target.getAttributeNames().forEach(attributeName => {
        if (/^data-dialog-(.+)/i.test(attributeName)) {
          var dataDialogBoxPropKey = camel(attributeName.replace(/^data-dialog-/i, ''))

          dataDialogBoxPropKey = dataDialogBoxPropKey.charAt(0).toLowerCase() + dataDialogBoxPropKey.slice(1)

          dataDialogBoxProps[dataDialogBoxPropKey] = event.target.getAttribute(attributeName)
        }
      })

      if (dataDialogBoxPropName && 'function' === typeof appDialogViewsObjectRef[dataDialogBoxPropName]) {
        event.preventDefault()

        if (noNullHref(href)) {
          window.history.pushState({}, 'Dialog', href)
        }

        App.call('openDialogBox', { size, href, ...dataDialogBoxProps }, appDialogViewsObjectRef[dataDialogBoxPropName])
      }
    })
  })
}
