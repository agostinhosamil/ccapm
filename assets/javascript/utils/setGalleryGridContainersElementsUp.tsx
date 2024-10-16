// import { arraySplit } from "."
import { CSSProperties, MouseEvent } from "react"

import styled from "./styled/styled"
import { createInlineStyles, createStyles } from "./styled/createStyles"
import { j, r, noEmpty, randFromRange, range } from "."
import { ref } from "./ref"

type Styles = {
  [key: string]: CSSProperties
}

type GalleryImageElementProps = {
  src: string
  alt: string
  width: number
  height: number
  id: number
}

type KeyHandlerMap = {
  [key: string]: (event?: KeyboardEvent) => void
}

const handledElements: Array<HTMLElement> = []

export function setGalleryGridContainersElementsUp() {
  const galleryContainerElements = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-grid]'))

  for (const galleryContainerElement of galleryContainerElements) {
    if (handledElements.indexOf(galleryContainerElement) >= 0) {
      continue
    }

    handledElements.push(galleryContainerElement)

    const styles: Styles = {
      galleryItem: {
        width: '100%',
        height: 'auto',
        padding: '5px',
        boxSizing: 'border-box'
      }
    }

    galleryContainerElement.style.cssText = createStyles(
      {
        width: '100%',
        height: '100%'
      },
      {
        inline: true
      }
    )

    const galleryContainerElementChildren = Boolean(galleryContainerElement.querySelector('[data-gallery-grid-item]'))
      ? Array.from(galleryContainerElement.querySelectorAll('[data-gallery-grid-item]'))
      : Array.from(galleryContainerElement.children).filter((child) => Boolean(child.nodeType === 1))

    // const galleryLines = arraySplit(galleryContainerElementChildren, 4 /* adjust this value according to the parent element width */)

    let i = 0,
      n = 0,
      currentLineColumnsCount = 0

    const galleryImageList: Array<GalleryImageElementProps> = []

    while (i < galleryContainerElementChildren.length) {
      const limitRange = range(1, 4)

      if (limitRange.indexOf(currentLineColumnsCount)) {
        limitRange.splice(limitRange.indexOf(currentLineColumnsCount), 1)
      }

      const limit = randFromRange(limitRange)

      currentLineColumnsCount = limit

      const elementsRange = galleryContainerElementChildren.slice(i, i + limit)

      i += limit

      let rowItemsHeight = 0

      elementsRange.forEach((element) => {
        const galleryItem = element as HTMLElement

        const galleryItemImage = galleryItem.querySelector<HTMLImageElement>('img')

        if (galleryItemImage) {
          if (galleryItemImage.offsetHeight > rowItemsHeight) {
            rowItemsHeight = galleryItemImage.offsetHeight
          }

          galleryItemImage.setAttribute('data-id', String(n))

          const { src, alt, offsetHeight: height, offsetWidth: width } = galleryItemImage

          galleryImageList.push({ alt, src, width, height, id: n++ })
        }
      })


      // console.log({ galleryImageList })

      const getImageBackgroundSize = (image: HTMLImageElement | GalleryImageElementProps): string => {
        const imageWidthPercentFromHeight = image instanceof HTMLElement
          ? ((image.offsetHeight / image.offsetWidth) * 100)
          : ((image.height / image.width) * 100)

        if (imageWidthPercentFromHeight >= 300) {
          return '100% auto'
        }

        return 'auto 100%'
      }

      const getImageSizeData = (imageDataObject: GalleryImageElementProps) => {
        const { height, width } = imageDataObject

        const imageWidth = width >= (window.innerWidth - 70)
          ? window.innerWidth - 70
          : width

        const imageHeight = height >= (window.innerHeight - 210)
          ? window.innerHeight - 210
          : height

        return {
          width: imageWidth,
          height: imageHeight
        }
      }

      const galleryItemImageElementClickHandler = (event: MouseEvent) => {
        const imageElementRef = ref<HTMLImageElement>()
        const galleryImageListRef = ref<HTMLUListElement>()
        const selectedImageElement = event.target as HTMLElement

        const selectedImageSrc = String(selectedImageElement.getAttribute('data-src'))
        const selectedImageId = String(selectedImageElement.getAttribute('data-id'))

        const imageDataObject = galleryImageList.find(galleryImage => galleryImage.id === Number(selectedImageId))

        if (noEmpty(selectedImageSrc) && imageDataObject) {

          const { height, width } = getImageSizeData(imageDataObject)

          // const imageWidth = width >= (window.innerWidth - 70)
          //   ? window.innerWidth - 70
          //   : width

          // const imageHeight = height >= (window.innerHeight - 210)
          //   ? window.innerHeight - 210
          //   : height

          const GalleryImageViewer = styled.div({
            position: 'fixed',
            top: '0px',
            left: '0px',
            backgroundColor: 'rgb(0 0 0 / 97%)',
            width: '100%',
            height: '100%',
            zIndex: '5000',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',

            'img': {
              borderRadius: '16px',
              width: `${width}px`,
              height: `${height}px`,
            },

            '.gallery-image-list': {
              width: `96%`,
              height: 'auto',
              backgroundColor: 'transparent',
              padding: '20px 0px 0px',
              position: 'fixed',
              bottom: '20px',

              ul: {
                width: '100%',
                height: '60px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',

                li: {
                  width: '60px',
                  height: '60px',
                  marginRight: '12px',

                  i: {
                    display: 'block',
                    width: 'inherit',
                    height: 'inherit',
                    backgroundAttachment: 'scroll',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: '#fbfbfb',
                    borderRadius: '12px',
                    cursor: 'pointer',

                    '&.selected': {
                      border: '2px solid red'
                    }
                  }
                }
              }
            },

            '.close-button-container': {
              position: 'absolute',
              right: '30px',
              top: '20px',

              'button': {
                backgroundColor: 'transparent',
                fontSize: '29px',
                fontWeight: '400',
                color: '#ffffff',
                border: '0px',
                outline: '0px',

                '&:hover': {
                  color: '#ebebeb'
                }
              }
            },

            'div.nav-button': {
              position: 'fixed',
              top: '0px',
              bottom: '0px',
              margin: 'auto',
              width: '40px',
              height: '60px',

              button: {
                outline: '0px',
                border: '0px',
                backgroundColor: 'transparent',
                backgroundSize: '100% auto',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: 'inherit',
                height: 'inherit'
              },

              '&.next-button': {
                right: '20px',

                button: {
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjUuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMyBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTI3OC42IDIzMy40YzEyLjUgMTIuNSAxMi41IDMyLjggMCA0NS4zbC0xNjAgMTYwYy0xMi41IDEyLjUtMzIuOCAxMi41LTQ1LjMgMHMtMTIuNS0zMi44IDAtNDUuM0wyMTAuNyAyNTYgNzMuNCAxMTguNmMtMTIuNS0xMi41LTEyLjUtMzIuOCAwLTQ1LjNzMzIuOC0xMi41IDQ1LjMgMGwxNjAgMTYweiIvPjwvc3ZnPg==")'
                }
              },

              '&.prev-button': {
                left: '20px',

                button: {
                  backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjUuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMyBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTQxLjQgMjMzLjRjLTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zbDE2MCAxNjBjMTIuNSAxMi41IDMyLjggMTIuNSA0NS4zIDBzMTIuNS0zMi44IDAtNDUuM0wxMDkuMyAyNTYgMjQ2LjYgMTE4LjZjMTIuNS0xMi41IDEyLjUtMzIuOCAwLTQ1LjNzLTMyLjgtMTIuNS00NS4zIDBsLTE2MCAxNjB6Ii8+PC9zdmc+")'
                }
              },
            }
          })

          const windowKeydownHandler = (event: KeyboardEvent) => {
            const keyHandlerMap: KeyHandlerMap = {
              handleEscape() {
                closeButtonClickHandler()
              },

              handleArrowRight() {
                const selectedImageId = getSelectedImageId()

                selectGalleryImage(1 + selectedImageId)
              },

              handleArrowLeft() {
                const selectedImageId = getSelectedImageId()

                if (selectedImageId >= 1) {
                  selectGalleryImage(-1 + selectedImageId)
                }
              },
            }

            const keyHandler = keyHandlerMap[`handle${event.key}`]

            if (typeof keyHandler === 'function') {
              keyHandler(event)
            }
          }

          const galleryNextButtonClickHandler = (event: MouseEvent): void => {
            const selectedImageId = getSelectedImageId()

            selectGalleryImage(1 + selectedImageId)
          }

          const galleryPrevButtonClickHandler = (event: MouseEvent): void => {
            const selectedImageId = getSelectedImageId()

            if (selectedImageId >= 1) {
              selectGalleryImage(-1 + selectedImageId)
            }
          }

          const closeButtonClickHandler = () => {
            document.body.removeChild(galleryImageViewerElement)

            window.removeEventListener('keydown', windowKeydownHandler, true)
          }

          const getSelectedImageId = (): number => {
            if (galleryImageListRef.current) {
              const selectedImageThumbElement = galleryImageListRef.current.querySelector<HTMLElement>('i.selected')

              if (selectedImageThumbElement) {
                return Number(selectedImageThumbElement.getAttribute('data-id'))
              }
            }

            return -1
          }

          const getGalleryImageById = (galleryImageId: number): GalleryImageElementProps | undefined => {
            const galleryImage = galleryImageList.find(galleryImage => (
              galleryImage.id === galleryImageId
            ))

            return galleryImage
          }

          window.addEventListener('keydown', windowKeydownHandler, true)

          const selectGalleryImage = (galleryImageId: number): void => {
            const galleryImage = getGalleryImageById(galleryImageId)

            if (!galleryImage) {
              return
            }

            const { width, height } = getImageSizeData(galleryImage)

            if (imageElementRef.current && galleryImageListRef.current) {
              imageElementRef.current.style.cssText = createInlineStyles({
                width: `${width}px`,
                height: `${height}px`
              })

              Array.from(galleryImageListRef.current.querySelectorAll('i.selected'))
                .forEach(element => element.classList.remove('selected'))

              const selectedImageThumbElement = galleryImageListRef.current.querySelector<HTMLElement>(`i[data-id="${galleryImage.id}"]`)

              if (selectedImageThumbElement) {
                selectedImageThumbElement.classList.add('selected')
              }

              imageElementRef.current.src = galleryImage.src
            }
          }

          const galleryImageListItemClickHandler = (galleryImage: GalleryImageElementProps) => {
            selectGalleryImage(galleryImage.id)
          }

          const galleryImageViewerElement = j(
            <GalleryImageViewer>
              <div className="close-button-container">
                <button onClick={closeButtonClickHandler}>X</button>
              </div>
              <div className="nav-button next-button">
                <button onClick={galleryNextButtonClickHandler} />
              </div>
              <div className="nav-button prev-button">
                <button onClick={galleryPrevButtonClickHandler} />
              </div>
              <div className="image-container">
                <img ref={imageElementRef} src={selectedImageSrc} alt="Gallery Image" className="image" />
              </div>
              <div className="gallery-image-list">
                <ul ref={galleryImageListRef} data-carrousel-list>
                  {galleryImageList.map(galleryImage => {
                    const styles = {
                      backgroundImage: `url(${galleryImage.src})`,
                      backgroundSize: getImageBackgroundSize(galleryImage)
                    }

                    return (
                      <li>
                        <i data-id={galleryImage.id} onClick={() => galleryImageListItemClickHandler(galleryImage)} className={Number(selectedImageId) === galleryImage.id ? 'selected' : ''} style={styles}></i>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </GalleryImageViewer>
          )

          document.body.appendChild(galleryImageViewerElement)
        }
      }

      const eachRowItemWidth = (galleryContainerElement.offsetWidth / limit)
      const galleryItemImageWidthPercentFromHeight = ((rowItemsHeight / eachRowItemWidth) * 100)

      rowItemsHeight = galleryItemImageWidthPercentFromHeight >= 300
        ? eachRowItemWidth * 2
        : rowItemsHeight / limit

      const rowElement = j(
        <div className="row">
          {elementsRange.map(element => {
            const galleryItem = element as HTMLElement

            const galleryItemImage = galleryItem.querySelector<HTMLImageElement>('img')

            if (galleryItemImage) {

              // rowItemsHeight = rowItemsHeight / limit


              // if () {
              //   console.log(galleryItemImageWidthPercentFromHeight)
              // }

              // rowItemsHeight = galleryItemImageWidthPercentFromHeight >= 300
              //   ? (galleryContainerElement.offsetWidth / limit) * 2
              //   : rowItemsHeight / limit

              const galleryItemImageElement = (
                <div
                  onClick={galleryItemImageElementClickHandler}
                  data-src={galleryItemImage.src}
                  data-id={String(galleryItemImage.getAttribute('data-id'))}
                  style={{
                    backgroundAttachment: 'scroll',
                    backgroundPosition: 'center',
                    backgroundSize: getImageBackgroundSize(galleryItemImage),
                    backgroundImage: `url(${galleryItemImage.src})`,
                    backgroundRepeat: 'no-repeat',
                    height: `${rowItemsHeight}px`,
                    width: '100%',
                    borderRadius: 'inherit',
                    cursor: 'pointer'
                  }}
                />
              )

              galleryItem.insertBefore(j(galleryItemImageElement), galleryItemImage)
              galleryItem.removeChild(galleryItemImage)
            }

            return (
              <div className={`col-md-${12 / limit}`} style={styles.galleryRow}>
                <div style={styles.galleryItem}>
                  {r(galleryItem)}
                </div>
              </div>
            )
          })}
        </div>
      )

      galleryContainerElement.appendChild(rowElement)
    }
  }
}
