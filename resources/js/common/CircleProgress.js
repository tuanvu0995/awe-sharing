import React from 'react'
import pt from 'prop-types'

const CircleProgerss = ({ children, progress, radius, stroke }) => {
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference
    console.log(strokeDashoffset)
  const style = {
    transform: `rotate(-${strokeDashoffset}deg)`,
  }

  const circularStyle = {
    height: radius * 2,
    width: radius * 2,
  }
  const innerStyle = {
    height: circularStyle.height - 4,
    width: circularStyle.width - 4,
    margin: `-${(circularStyle.height - 4) / 2}px 0 0 -${(circularStyle.height - 4) / 2}px`,
  }
  return (
    <div className="circular" style={circularStyle}>
      <div className="inner" style={innerStyle}>
        {children}
      </div>
      <div className="circle">
        <div className="bar left" style={style} fill={50}>
          <div className="progress"></div>
        </div>
        <div className="bar right">
          <div className="progress"></div>
        </div>
      </div>
    </div>
  )
}

CircleProgerss.propTypes = {
  progress: pt.number,
}

CircleProgerss.defaultProps = {
  progress: 0,
}

export default CircleProgerss
