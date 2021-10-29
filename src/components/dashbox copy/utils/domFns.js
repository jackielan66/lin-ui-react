/**
 * 防止移动或拖动选中其他文本的hack
 *
 * @export
 * @param {*} doc
 */

const FIX_DRAG_SELECTION_HACK_NAME = 'cim-react-draggable-style-el'

export function addUserSelectStyles(doc) {
  if (!doc) return
  let styleEl = doc.getElementById('react-draggable-style-el')
  if (!styleEl) {
    styleEl = doc.createElement('style')
    styleEl.type = 'text/css'
    styleEl.id = 'react-draggable-style-el'
    styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n'
    styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n'
    doc.getElementsByTagName('head')[0].appendChild(styleEl)
  }
  if (doc.body) {
    doc.body.classList.add('react-draggable-transparent-selection')
    // addClassName(doc.body, 'react-draggable-transparent-selection')
  }
}

export function removeUserSelectStyles(doc) {
  if (!doc) return
  try {
    if (doc.body) {
      doc.body.classList.remove('react-draggable-transparent-selection')
    }
    // $FlowIgnore: IE
    if (doc.selection) {
      // $FlowIgnore: IE
      doc.selection.empty()
    } else {
      // Remove selection caused by scroll, unless it's a focused input
      // (we use doc.defaultView in case we're in an iframe)
      const selection = (doc.defaultView || window).getSelection()
      if (selection && selection.type !== 'Caret') {
        selection.removeAllRanges()
      }
    }
  } catch (e) {
    // probably IE
  }
}
