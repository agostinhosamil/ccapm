import React from 'react'
import { createRoot } from 'react-dom/client'

export type RenderOptions = {
  destroy: () => void
}

export type RootStoreData = RenderOptions & {
  key: string
}

export type RootStore = Array<RootStoreData>

const rootStore: RootStore = []

export const getRoot = (key: string): RootStoreData | undefined => {
  return rootStore.find(root => root.key === key)
}

export const storedRoot = (key: string): boolean => Boolean(getRoot(key))

export const render = <ComponentProps = any>(key: string, container: HTMLElement, Component: React.FunctionComponent<ComponentProps>): RenderOptions => {
  const root = createRoot(container)

  if (!storedRoot(key)) {
    rootStore.push({
      key,
      destroy() {
        root.unmount()
      },
    })
  }

  root.render(<Component />)

  return {
    destroy() {
      root.unmount()
    },
  }
}
