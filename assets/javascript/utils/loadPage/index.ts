import axios, { AxiosProgressEvent } from 'axios'

import { getObjectProp, noEmpty, noNullHref } from '~/utils'
import { loadingProgressElement } from './loadingProgressElement'
import { App } from '~/App'

export type RouteData = {
  route: string,
  params: {
    [key: string]: string
  },
  request: {
    method: string,
    body: []
  },
  data: {
    route: string,
    layout: RouteLayout
  }
}

export type RouteLayout = {
  id: string,
  name: string,
  parents: Array<RouteLayout>
}

export type ViewLayoutData = {
  layoutId: string
  layoutRendered: boolean
  progress: PageProgress
}

type RouteDataGetterOptions = {
  progress: PageProgress
}

type LayoutContentRendererProps = {
  layoutId: string
  pagePath: string
  parentLayoutId: string,
  progress: PageProgress
}

type PageProgress = {
  end: () => void
  startProgress: () => void
  updateProgress: (value: AxiosProgressEvent) => void
}

const getRouteData = async (route: string, { progress }: RouteDataGetterOptions): Promise<RouteData> => {
  const response = await axios.get<RouteData>(route, {
    headers: {
      '---trounex-action': 'get-route-data'
    },
    onDownloadProgress(progressEvent) {
      progress.updateProgress(progressEvent)
    },
  })

  return response.data
}

const getViewContent = async (viewRoute: string, options: ViewLayoutData): Promise<string> => {
  const response = await axios.get<string>(viewRoute, {
    headers: {
      '---trounex-action': 'render-view',
      '---trounex-action-arguments': (
        `skip-layout-stack-render=yes,` +
        `view-layout-id=${options.layoutId},` +
        `render-view-layout=${options.layoutRendered ? 'no' : 'yes'}`
      )
    },
    onDownloadProgress(progressEvent) {
      options.progress.updateProgress(progressEvent)
    }
  })

  return response.data
}

const renderLayoutContent = async ({ layoutId, parentLayoutId, pagePath, progress }: LayoutContentRendererProps): Promise<boolean> => {
  const routeLayoutOpenElement = document.querySelector<HTMLDivElement>(`[data-trounex-layout-open="${parentLayoutId}"]`)
  const routeLayoutCloseElement = document.querySelector<HTMLDivElement>(`[data-trounex-layout-close="${parentLayoutId}"]`)

  const routeViewContent = await getViewContent(pagePath, {
    progress,
    layoutId: layoutId,
    layoutRendered: Boolean(
      routeLayoutOpenElement instanceof HTMLDivElement
      && layoutId == parentLayoutId
    )
  })

  const isLayoutElement = (element: Element, layoutElement: HTMLDivElement): boolean => {
    if (element instanceof HTMLDivElement) {
      const layoutElements = [
        layoutElement
      ]

      return layoutElements.indexOf(element) >= 0
    }

    return false
  }

  const isLayoutOpenElement = (element: Element): boolean => {
    if (routeLayoutOpenElement) {
      return isLayoutElement(element, routeLayoutOpenElement)
    }

    return false
  }

  const isLayoutCloseElement = (element: Element): boolean => {
    if (routeLayoutCloseElement) {
      return isLayoutElement(element, routeLayoutCloseElement)
    }

    return false
  }

  if (noEmpty(layoutId) && routeLayoutOpenElement && routeLayoutCloseElement) {
    const routeLayoutOpenElementParent = routeLayoutOpenElement.parentNode as HTMLElement

    window.history.pushState({}, pagePath, pagePath)

    if (routeLayoutOpenElementParent) {
      const routeLayoutOpenElementParentChildren = Array.from(routeLayoutOpenElementParent.children)

      const routeLayoutOpenElementIndex = routeLayoutOpenElementParentChildren.indexOf(routeLayoutOpenElement)

      for (let i = routeLayoutOpenElementIndex + 1; i < routeLayoutOpenElementParentChildren.length; i++) {
        const routeLayoutOpenElementParentChild = routeLayoutOpenElementParentChildren[i]

        if (isLayoutCloseElement(routeLayoutOpenElementParentChild))
          break

        routeLayoutOpenElementParent.removeChild(routeLayoutOpenElementParentChild)
      }

      const routeLayoutContentWrapper = document.createElement('div')

      routeLayoutContentWrapper.innerHTML = routeViewContent

      Array.from(routeLayoutContentWrapper.children)
        .forEach((routeLayoutContentWrapperChild, index) => {
          try {
            routeLayoutOpenElementParent.insertBefore(routeLayoutContentWrapperChild, routeLayoutCloseElement)

            if (index === 0 && routeLayoutContentWrapperChild.scrollIntoView) {
              routeLayoutContentWrapperChild.scrollIntoView({
                behavior: 'smooth'
              })
            }
          } catch (err) {
            return
          }
        })

      return true
    }
  }

  return false
}

const startPageProgressLoading = (): PageProgress => {
  return {
    end() {
      const dataPageLoadingProgressBars = document.querySelectorAll('[data-element="page-loading-progress-bar"]')

      if (dataPageLoadingProgressBars.length >= 1) {
        try {
          for (let i = 0; i < dataPageLoadingProgressBars.length; i++) {
            document.body.removeChild(dataPageLoadingProgressBars[i])
          }
        } catch (err) {
          return
        }
      }
    },

    updateProgress() { },

    startProgress() {
      document.body.appendChild(App.createElement(loadingProgressElement, {
        'data-element': 'page-loading-progress-bar'
      }))
    }
  }
}

export const loadPage = async (pagePath: string): Promise<RouteData | undefined> => {
  if (!noNullHref(pagePath)) {
    return
  }

  const progress: PageProgress = startPageProgressLoading()

  progress.startProgress()

  const routeData = await getRouteData(pagePath, { progress })
  const routeLayoutId = String(getObjectProp<string>(routeData, 'data.layout.id'))
  const routeLayoutParents = getObjectProp<Array<RouteLayout>>(routeData, 'data.layout.parents')

  const shouldRender = await renderLayoutContent({
    layoutId: routeLayoutId,
    parentLayoutId: routeLayoutId,
    pagePath,
    progress
  })

  if (!shouldRender && routeLayoutParents instanceof Array) {
    let rendered = false
    // let currentLayoutId = routeLayoutId
    // console.log({ routeData, routeLayoutParents })

    await Promise.all(routeLayoutParents.map(async (routeLayoutParent, i): Promise<void> => {
      // console.log({ routeLayoutParent })

      if (!rendered) {
        const currentLayoutId = i >= 1 ? routeLayoutParents[-1 + i].id : routeLayoutId

        rendered = await renderLayoutContent({
          layoutId: currentLayoutId, // routeLayoutParent.id,
          parentLayoutId: routeLayoutParent.id,
          pagePath,
          progress
        })

        // currentLayoutId = routeLayoutParent.id
        // if (rendered) {
        //   console.log('rendered>> ', routeLayoutParent)
        // }
        // console.log({ rendered })
      }
    }))
  }

  progress.end()

  // console.log('Why>>3', {
  //   routeLayoutId,
  //   routeLayoutOpenElement,
  //   routeLayoutCloseElement
  // })

  // console.log(routeViewContent)

  return routeData
}
