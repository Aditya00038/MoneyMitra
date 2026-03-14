import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { FinanceProvider } from './finance/FinanceContext.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <App />
          <Toaster position="top-right" richColors />
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
