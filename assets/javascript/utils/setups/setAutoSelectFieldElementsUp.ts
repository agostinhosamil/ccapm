import { configAutoSelectField } from "../configAutoSelectField"

export function setAutoSelectFieldElementsUp() {
  document.querySelectorAll('select[data-select-box]')
    .forEach(configAutoSelectField)
}
