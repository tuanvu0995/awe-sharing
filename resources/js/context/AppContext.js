import React, { useState } from 'react'

const AppContext = React.createContext()

export const withAppContext = (Component, mapContextToProps) => {
  const Consumer = (props) => (
    <AppContext.Consumer>
      {(context) => {
        let contextProps = mapContextToProps ? mapContextToProps(context) : context
        if (!contextProps.setState) {
          contextProps.setState = context.setState
        }
        if (!contextProps.socket) {
          contextProps.socket = context.socket
        }
        contextProps = { ...props, ...contextProps }
        return <Component {...contextProps} />
      }}
    </AppContext.Consumer>
  )
  return Consumer
}

export default AppContext
