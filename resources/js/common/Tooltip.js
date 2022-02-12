import React, { useState } from 'react'
import { usePopper } from 'react-popper'

const Tooltip = ({ children, content, canShow = false }) => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 5] } },
    ],
  })

  return (
    <>
      <div ref={setReferenceElement}>{children}</div>
      {canShow && (
        <div
          className="tooltip"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {content}
          <div className="tootip-arrow" ref={setArrowElement} style={styles.arrow} />
        </div>
      )}
    </>
  )
}

export default Tooltip
