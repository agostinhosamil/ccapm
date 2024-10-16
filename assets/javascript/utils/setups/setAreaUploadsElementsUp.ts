import { noEmpty } from ".."
import { createInlineStyles } from "../styled/createStyles"

export function setAreaUploadsElementsUp() {
  const areaUploadElements = document.querySelectorAll<HTMLLabelElement>('label[data-area-upload]')

  const areaUploadErrorStyles = createInlineStyles({
    borderColor: 'red'
  })

  const createAreaUploadSuccessStyles = (imageDataUrl: string): string => {
    return createInlineStyles({
      backgroundAttachment: 'scroll',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% auto',
      backgroundImage: `url(${imageDataUrl})`,
      color: '#ffffff',
      fontWeight: '900',
      textShadow: 'rgb(0 0 0 / 67%) 4px 5px 6px'
    })
  }

  Array.from<HTMLLabelElement>(areaUploadElements)
    .filter((areaUploadElement) => (Object.keys(areaUploadElement).indexOf('__setup') < 0))
    .forEach((areaUploadElement) => {
      Object.defineProperty(areaUploadElement, '__setup', {
        value: true
      })

      const dataTargetInputElementId = String(areaUploadElement.getAttribute('for'))

      if (noEmpty(dataTargetInputElementId)) {
        const dataTargetInputElement = document.querySelector<HTMLInputElement>(`input[type=file]#${dataTargetInputElementId}`)

        if (!dataTargetInputElement) {
          return
        }

        // window.ondrop

        areaUploadElement.addEventListener('dragenter', (event: DragEvent) => {
          // event.preventDefault()
          console.log('>>> dragenter', event.dataTransfer?.files)
        })

        areaUploadElement.addEventListener('dragleave', (event: DragEvent) => {
          // event.preventDefault() 
          console.log('>>> dragleave', event.dataTransfer?.files)
        })

        areaUploadElement.addEventListener('dragend', (event: DragEvent) => {
          // event.preventDefault() 
          console.log('>>> dragend', event.dataTransfer?.files)
        })

        areaUploadElement.addEventListener('drop', (event: DragEvent) => {
          event.preventDefault()

          const { dataTransfer } = event

          console.log('>>> drop', dataTransfer?.files)
        })

        dataTargetInputElement.addEventListener('change', () => {
          const files = Array.from<File>(dataTargetInputElement.files || [])

          // if (dataTargetInputElement.multiple) {
          //   return
          // }
          files.forEach((file) => {
            const imageUrl = URL.createObjectURL(file)

            areaUploadElement.style.cssText = createAreaUploadSuccessStyles(imageUrl)
          })
        })
      }
    })
}
