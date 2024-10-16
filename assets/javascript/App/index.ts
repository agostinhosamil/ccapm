import { mergeArrays } from '~/utils'
import { ReiteComponentProps } from 'Types/ReiteComponentProps'
import { AppBaseContext, AppContext, Scope, ReiteComponentChildren } from 'Types/App'
import { ElementPropertySetters, ElementTagRef, FunctionComponent, HTMLElementRef } from 'Types/Reite'
import { createStyles } from '~/utils/styled/createStyles'

type HTMLChildElement =
  Element
  | Array<Element>
  | string
  | undefined
  | null
  | Array<HTMLChildElement>

function _createElement(elementTagName: ElementTagRef, props: ReiteComponentProps, ...children: ReiteComponentChildren): HTMLElement {
  function throwElementTagNameError(): void {
    throw new TypeError('Element tag name must to be a valid reference')
  }

  function rewriteElementPropName(property: string): string {
    const particularCases: ReiteComponentProps = {
      className: 'class'
    }

    if (typeof particularCases[property] === 'string') {
      return particularCases[property]
    }

    return property.toLowerCase()
  }

  if (!(/^(function|string)$/i.test(typeof elementTagName))) {
    throwElementTagNameError()
  }

  const element: (HTMLElement | FunctionComponent) = typeof elementTagName === 'string'
    ? document.createElement(elementTagName)
    : elementTagName

  // const children = Array.from(arguments).slice(2, arguments.length)

  if (props.children && !(props.children instanceof Array)) {
    props.children = [props.children]
  }

  if (typeof element === 'function') {
    const componentHandler = element.bind(element)

    props = props && props instanceof Object ? props : props

    Object.assign(props, {
      children: mergeArrays(children, props.children as (typeof children))
    })

    return componentHandler(props)
  } else if (!(element instanceof HTMLElement)) {
    throwElementTagNameError()
  }

  const elementPropertySetters: ElementPropertySetters = {
    setRef: function ($this, ref: HTMLElementRef) {
      if (ref instanceof Array) {
        ref.forEach((currentRef) => {
          elementPropertySetters.setRef($this, currentRef)
        })
      } else if (typeof ref === 'object') {
        ref.current = $this
      } else if (typeof ref === 'function') {
        ref.apply($this, [$this])
      }
    },

    setKey: function ($this, key: string) {
      $this.key = key
    },

    setStyle: function ($this, styles) {
      $this.style.cssText += typeof styles === 'string'
        ? styles
        : createStyles(styles, {
          inline: true,
          elementRef: ''
        })
    }
  }

  if (props instanceof Object) {
    for (const key in props) {
      const keyFirstCharToUpper = [key.charAt(0).toUpperCase(), key.slice(1)].join('')
      const propertySetter = ['set', keyFirstCharToUpper].join('') as keyof ElementPropertySetters
      const eventNameRe = /^on/i

      const prop = props[key as keyof ReiteComponentProps]

      if (typeof elementPropertySetters[propertySetter] === 'function'
        && element instanceof HTMLElement) {
        elementPropertySetters[propertySetter](element, prop)
      } else if (eventNameRe.test(key) && 'function' === typeof prop) {
        element.addEventListener(key.replace(eventNameRe, '').toLowerCase(), function (this: HTMLElement) {
          return prop.apply(this, arguments)
        })
      } else if (!/(children|key)/i.test(key) && /^([^0-9\s])/.test(key)) {
        element.setAttribute(rewriteElementPropName(key), String(prop))
      }
    }
  }

  function renderElementChildren(parentElement: HTMLElement, child: HTMLChildElement): void {
    function isIgnorableChild(child: any) {
      return Boolean(
        child === null ||
        typeof child === typeof 'str' && !/\S/.test(child) ||
        typeof true === typeof child ||
        !child
      )
    }

    if (isIgnorableChild(child)) {
      return
    }

    if (child instanceof HTMLElement) {
      parentElement.appendChild(child)
      return
    } else if (child instanceof Array) {
      return child.forEach((currentChild) => {
        return renderElementChildren(parentElement, currentChild)
      })
    }

    const textContent = typeof child === 'string' ? child : JSON.stringify(child)
    const textElement = document.createTextNode(textContent)

    parentElement.appendChild(textElement)
  }

  mergeArrays(children, props.children as (typeof children))
    .forEach((child) => {
      if (typeof child === 'function') {
        return renderElementChildren(element, child({}))
      }

      return renderElementChildren(element, child)
    })

  return element
}

const app: AppBaseContext = {
  scopes: {},

  define: function (property, value) {
    app[property] = value
  },

  get: function (property) {
    const propertyValue = app[property]

    if (propertyValue instanceof HTMLElement) {
      return propertyValue.cloneNode()
    }

    return propertyValue
  },

  getScope: function (scopeKey) {
    if (typeof scopeKey === 'string'
      && typeof undefined !== typeof app.scopes[scopeKey]) {
      return app.scopes[scopeKey]
    }

    throw new Error(`app:error >>> scope '${scopeKey}' does not exists`)
  },

  createScope: function (scopeKey, scopeImports) {
    app.scopes[scopeKey] = {
      __key__: scopeKey
    }

    if (scopeImports instanceof Array) {
      scopeImports.forEach((scopeImport) => {
        const scopeImportObject = app.getScope(scopeImport)

        if (scopeImportObject) {
          app.scopes[scopeKey][scopeImport] = scopeImportObject
        }
      })
    }

    return app.scopes[scopeKey]
  },

  createOrGetScope: function (scopeKey, scopeImports) {
    try {
      const scopeObject = app.getScope(scopeKey)

      if (scopeObject) {
        return scopeObject
      }
    } catch (err) {
    }

    return this.createScope(scopeKey, scopeImports)
  }
}

export const App: AppContext = {
  scope: function (scopeKey, scopeImports = [], scopeBodyContext = null) {
    scopeImports = scopeImports instanceof Array ? scopeImports : []

    const scope = app.createOrGetScope(scopeKey, scopeImports)

    if (scope && 'function' === typeof scopeBodyContext) {
      const scopeBodyContextArguments = scopeImports.map<Scope>(function (scopeImport) {
        return scope[scopeImport]
      })

      window.document.addEventListener('readystatechange', function () {
        if (window.document.readyState === 'complete') {
          scopeBodyContext.apply(scope, scopeBodyContextArguments)
        }
      })
    }

    return scope
  },

  define: function (...args) {
    return app.define(...args)
  },

  get: function (...args) {
    return app.get(...args)
  },

  call: function (funcName, args) {
    const argumentsList = !(args instanceof Array)
      ? Array.from(arguments).slice(1, arguments.length)
      : args

    const funcHandler = this.get(funcName)

    if (typeof funcHandler === 'function') {
      return funcHandler.apply(this, argumentsList)
    }

    throw new TypeError(`'${funcName}' is not a valid function in the App scope`)
  },

  createElement: function (...args) {
    return _createElement(...args)
  },

  render: function (element, targetElement) {
    if (!(targetElement instanceof HTMLElement)) {
      throw new TypeError('Target element is not a valid html element object')
    }

    element = element instanceof HTMLElement ? element : (
      'function' === typeof element ? element() : null
    )

    if (element instanceof HTMLElement) {
      targetElement.innerHTML = ''

      targetElement.appendChild(element)

      return true
    }

    throw new TypeError('Element is not a valid html element or a component')
  }
}
