import React, { useState, createContext, useContext, useCallback } from 'react'

import { globalStore } from './globalStore'

/* type GlobalContextConsumerSetterData<ContextStoreProps> =
  ((props: ContextStoreProps) => Partial<ContextStoreProps>)
  | Partial<ContextStoreProps>

type GlobalContextConsumerResponse<ContextStoreProps> = ContextStoreProps & {
  set: (props: GlobalContextConsumerSetterData<ContextStoreProps>) => void
  onChange: (changeHandler: (store: ContextStoreProps) => void, props?: Array<string>) => void
}

type GlobalContextCreatorResponse<ContextStoreProps = any> = {
  consumer: () => GlobalContextConsumerResponse<ContextStoreProps>
  Provider: React.FunctionComponent<React.PropsWithChildren & {
    value?: ContextStoreProps
  }>
}

const someItemInIArray = (arr1: Array<string>, arr2: Array<string>): boolean => {
  for (let i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) >= 0) {
      return true
    }
  }

  return false
}

const watchers: Array<string> = []

export const createGlobalContext = <ContextStoreProps = any>(initialStore?: ContextStoreProps): GlobalContextCreatorResponse<ContextStoreProps> => {
  if (typeof initialStore === 'object' && initialStore) {
    Object.assign(globalStore, initialStore)
  }

  return {
    consumer() {
      const consumer: GlobalContextConsumerResponse<ContextStoreProps> = {
        ...(globalStore as ContextStoreProps),
        set(props) {
          const data = typeof props === 'function'
            ? props(this as ContextStoreProps)
            : props

          Object.assign(globalStore, data)

          globalStore.$$changeHandlers.forEach((changeHandler) => {
            const [handler, propList] = changeHandler

            if (propList instanceof Array && propList.length >= 1) {
              const someDataChanged = someItemInIArray(Object.keys(data), propList)

              // console.log({
              //   'changed': Object.keys(data),
              //   'watching': propList,

              //   someDataChanged
              // })

              if (!someDataChanged) {
                return
              }
            }

            console.log('Handlers =>', globalStore.$$changeHandlers)

            typeof handler === 'function' && handler(globalStore)
          })
        },

        // onChange(changeHandler, props = []) {

        //   const key = btoa(new Error().stack || '')

        //   console.log(`${key} >>>`, new Error().stack)

        //   if (watchers.indexOf(key) >= 0) {
        //     return
        //   }

        //   watchers.push(key)

        //   globalStore.$$changeHandlers.push([
        //     changeHandler, props
        //   ])
        // },
      } as GlobalContextConsumerResponse<ContextStoreProps>

      return consumer
    },

    Provider({ children }) {
      const [state, setState] = useState<ContextStoreProps>({} as ContextStoreProps)

      const it = createGlobalContext<ContextStoreProps>()
      const context = it.consumer()

      // context.onChange((newState) => {
      //   setState({ ...state, newState })
      // }, Object.keys(initialStore || {}))

      return (
        <React.Fragment>
          {children}
        </React.Fragment>
      )
    }
  }
}
 */

// type GlobalContextCreatorResponse<ContextStoreProps = any> = {}

type ContextStore<ContextStoreProps = any> = ContextStoreProps & ContextUtils<ContextStoreProps>

type StateSetter<ContextStoreProps = any> = (props: Partial<ContextStoreProps>) => void

type ContextUtils<ContextStoreProps> = {
  $$dispatchers: Array<StateSetter<ContextStoreProps>>
  $$setState: StateSetter<ContextStoreProps>

  set setState(stateSetter: StateSetter<ContextStoreProps>)
  get setState(): StateSetter<ContextStoreProps>
}

type GlobalContextCreatorResponse<ContextStoreProps = any> = {
  consumer: () => ContextStore<ContextStoreProps>
  Provider: React.FunctionComponent<React.PropsWithChildren & {
    value?: ContextStoreProps
  }>
}

/**
 * Create a global context
 * 
 * TODOs =>
 *  - Create a context (React Context API) 
 *    - use the global store object as the initial value (props) 
 */
export function createGlobalContext<ContextStoreProps = any>(initialStore?: ContextStoreProps): GlobalContextCreatorResponse<ContextStoreProps> {

  const tmpContext: ContextUtils<ContextStoreProps> = {
    $$dispatchers: [],

    $$setState(props) {
      this.$$dispatchers.forEach(dispatch => dispatch(props))
    },

    set setState(stateSetter: StateSetter<ContextStoreProps>) {
      if (this.$$dispatchers.indexOf(stateSetter) < 0) {
        this.$$dispatchers.push(stateSetter)
      }
    },

    get setState() {
      return this.$$setState
    },
  }

  const store: ContextStoreProps = {
    ...initialStore,
    ...globalStore,

    /**
     * state setter
     * @param props 
     */
    setState: (props: Partial<ContextStoreProps>) => {
      tmpContext.setState(props)
    }
  } as ContextStore<ContextStoreProps>

  const Context = createContext<ContextStoreProps>(store)

  Object.assign(globalStore, store)

  return {
    Provider: ({ children }) => {
      const [state, setState] = useState<ContextStoreProps>({
        ...(globalStore as ContextStoreProps),
      })

      const updateState = (props: Partial<ContextStoreProps>) => {
        Object.assign(globalStore, { ...state, ...props })

        tmpContext.setState({ ...state, ...props })
      }

      tmpContext.setState = useCallback((props) => {
        setState({ ...state, ...props })
      }, [])

      return (
        <Context.Provider value={{ ...state, setState: updateState }}>
          {children}
        </Context.Provider>
      )
    },

    consumer: () => {
      const context = useContext(Context)

      return context as ContextStore<ContextStoreProps>
    },
  }
}
