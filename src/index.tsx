import React from 'react'

import './index.css'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { App } from './app/App'
import { store } from './app/store'
import reportWebVitals from './reportWebVitals'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)

// If you want to start measuring performance in your m1-ui, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
