import React from 'react'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import * as ReactDOMClient from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOMClient.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
reportWebVitals()
