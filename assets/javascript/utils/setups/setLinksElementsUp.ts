import { loadPage } from "~/utils/loadPage"
import { getObjectProp, noNullHref, path } from "~/utils"

const handledLinkElements: Array<string> = []

const getPageUrlFromAnchorElement = (anchorElement: HTMLAnchorElement): URL => {
  const re = /^(https?:\/\/(.+))/i
  const linkElementHref = anchorElement.href

  const pageUrl: URL = re.test(linkElementHref)
    ? new URL(linkElementHref)
    : new URL(path(linkElementHref))

  return pageUrl
}

const isButtonRolledAnchor = (anchorElement: HTMLAnchorElement): boolean => {
  const re: RegExp = /button/i
  const anchorElementRole = anchorElement.getAttribute('role')

  return Boolean(
    typeof anchorElementRole === 'string'
    && re.test(anchorElementRole)
  )
}

const handlePageLoad = async (linkElement: HTMLAnchorElement, pageUrl: URL): Promise<void> => {
  const routeData = await loadPage(pageUrl.pathname)

  const generateLinkId = (linkPageLayoutId: string): string => {
    const slices: Array<string> = [
      'anchor',
      String(Math.random())
        .replace('.', '')
        .repeat(Math.round(Math.random() * 4) + 1),
      linkPageLayoutId
    ]

    return slices.join(':')
  }

  if (typeof routeData === 'object') {
    const dataLinkId = getObjectProp<string>(routeData, 'data.layout.id')
    linkElement.setAttribute('data-link-id', generateLinkId(String(dataLinkId)))
  }
}

const linkElementClickHandler = function (this: HTMLAnchorElement, event: MouseEvent) {
  event.preventDefault()

  const pageUrl: URL = getPageUrlFromAnchorElement(this)

  if (pageUrl.pathname !== location.pathname) {
    handlePageLoad(this, pageUrl)
  }
}

window.addEventListener('popstate', () => {
  const pageUrl = new URL(window.location.href)

  loadPage(pageUrl.pathname)
})

export const setLinksElementsUp = () => {
  const linkElements = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'))

  const handleLinkElement = (linkElement: HTMLAnchorElement): void => {
    const pageUrl: URL = getPageUrlFromAnchorElement(linkElement)

    if (pageUrl.hostname === window.location.hostname) {
      try {
        linkElement.removeEventListener('click', linkElementClickHandler, true)
      } catch (err) {
      } finally {
        linkElement.addEventListener('click', linkElementClickHandler, true)
      }
    }
  }

  for (const linkElement of linkElements) {
    const linkElementId: string = String(linkElement.getAttribute('data-link-id'))
    const linkElementHref = linkElement.getAttribute('href')

    if (handledLinkElements.indexOf(linkElementId) >= 0
      || !noNullHref(String(linkElementHref))
      || isButtonRolledAnchor(linkElement)) {
      continue
    }

    handleLinkElement(linkElement)
  }
}
