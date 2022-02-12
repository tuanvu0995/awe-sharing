const preventListEvent = ['dragenter', 'dragover', 'dragleave', 'drop']
const addHighLightEvent = ['dragenter', 'dragover']
const removeHighLightEvent = ['dragleave', 'drop']

export function highlight(dropArea) {
  return (e) => dropArea.classList.add('highlight')
}

export function unhighlight(dropArea) {
  return (e) => dropArea.classList.remove('highlight')
}

export function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

export function initDropPrevent(dropArea) {
  preventListEvent.forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
  })
  addHighLightEvent.forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight(dropArea), false)
  })
  removeHighLightEvent.forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight(dropArea), false)
  })
}

export default {
  highlight,
  unhighlight,
  preventDefaults,
}
