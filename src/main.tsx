import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ToastHost } from './components/ui/ToastHost'
import { createQueryClient } from './lib/query'
import './index.css'

async function enableSW() {
  try {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })
  } catch {
    /* PWA disabled (dev/test/build without plugin) */
  }
}
void enableSW()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={createQueryClient()}>
      <App />
      <ToastHost />
    </QueryClientProvider>
  </React.StrictMode>,
)
