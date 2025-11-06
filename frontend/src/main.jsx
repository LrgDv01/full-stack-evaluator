import React from 'react'
import ReactDoom from 'react-dom/client'
import App from './App.jsx'
import './styles/tailwind.css'
import './styles/globals.css' 

ReactDoom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
