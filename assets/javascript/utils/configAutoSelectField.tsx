import { j } from '.'
import { SelectBox } from '@components/SelectBox'

export const configAutoSelectField = function configAutoSelectField(selectElement: HTMLSelectElement) {
  const selectElementOptions = Array.from(selectElement.querySelectorAll('option'))
    .filter(option => option instanceof HTMLElement)

  const options = selectElementOptions.map(option => ({
    value: option.value,
    label: String(option.textContent).trim(),
    selected: selectElement.value == option.value
  }))

  if (!selectElement.parentNode) {
    return
  }

  const selectBox = j(<SelectBox options={options} selectElement={selectElement} />)

  selectElement.parentNode.insertBefore(selectBox, selectElement)

  selectElement.parentNode.removeChild(selectElement)
}
