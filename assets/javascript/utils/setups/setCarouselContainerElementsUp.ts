import { App } from '~/App'

export function setCarouselContainerElementsUp() {
  const carrouselContainerElements = [
    // document.querySelectorAll('ul.form-area_service-printing-format-list'),
    // document.querySelectorAll('div.area-feed-card-list-container ul.area-feed-card-list'),
    Array.from(document.querySelectorAll('[data-carrousel-list]'))
  ]

  App.call('setCarouselContainerElementsUp', [carrouselContainerElements])
}
