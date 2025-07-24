import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// Global error handler to suppress analytics errors
const originalConsoleError = console.error
console.error = (...args) => {
  // Suppress Blink analytics network errors
  const message = args[0]?.toString() || ''
  if (message.includes('Failed to send analytics events') || 
      message.includes('BlinkNetworkError') ||
      message.includes('analytics')) {
    return // Silently ignore analytics errors
  }
  originalConsoleError.apply(console, args)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster position="top-right" />
    <App />
  </React.StrictMode>,
) 