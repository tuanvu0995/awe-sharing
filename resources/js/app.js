import React from 'react'
import ReactDOM from 'react-dom'

import 'react-toastify/dist/ReactToastify.css';
import './app.scss'
import './client'

import App from './components/App'
import AppProvider from './context/AppProvider'

const domContainer = document.getElementById('app-root')
if (domContainer) {
  const Rendered = (
    <AppProvider>
      <App />
    </AppProvider>
  )
  ReactDOM.render(Rendered, domContainer)
}
