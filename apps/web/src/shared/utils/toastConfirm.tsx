import { toast } from 'react-hot-toast'

/**
 * Reemplaza `window.confirm()` con un toast interactivo de la paleta institucional.
 * Muestra un diálogo no bloqueante con botones "Confirmar" y "Cancelar".
 * @returns Promise<boolean> — `true` si el usuario confirmó, `false` si canceló
 */
export function confirmarConToast(mensaje: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast.custom(
      (t) => (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e4e1ea',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 8px 24px -4px rgba(0,6,102,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: '260px',
            maxWidth: '340px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#1b1b21', fontWeight: 600 }}>
            {mensaje}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true) }}
              style={{
                flex: 1,
                background: '#000666',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 0',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Confirmar
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false) }}
              style={{
                flex: 1,
                background: 'transparent',
                color: '#1b1b21',
                border: '1px solid #e4e1ea',
                borderRadius: '10px',
                padding: '8px 0',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  })
}
