'use client'
import { Toaster } from 'react-hot-toast'

/** Monta el contenedor de toasts con la paleta institucional SIC-UNNE. */
export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#ffffff',
          color: '#1b1b21',
          border: '1px solid #e4e1ea',
          borderRadius: '14px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 8px 24px -4px rgba(0,6,102,0.10)',
        },
        success: {
          iconTheme: { primary: '#000666', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
        },
      }}
    />
  )
}
