import { supabase } from '@/services/supabase'

export default async function Home() {
  // Intentamos traer los usuarios que creamos en Supabase
  const { data: usuarios, error } = await supabase.from('usuarios').select('*')

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#111', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#3ecf8e' }}>🎓 SIC - UNNE</h1>
      <p>Sistema de Gestión de Comisiones</p>
      <hr style={{ borderColor: '#333' }} />

      <section style={{ marginTop: '20px' }}>
        <h2>Estado del Backend:</h2>
        {error ? (
          <p style={{ color: '#ff4b4b' }}>❌ Error: {error.message}</p>
        ) : (
          <p style={{ color: '#3ecf8e' }}>✅ Conexión con Supabase exitosa</p>
        )}
      </section>

      <section style={{ marginTop: '20px' }}>
        <h3>Datos en la tabla 'usuarios':</h3>
        <div style={{ background: '#222', padding: '15px', borderRadius: '8px' }}>
          {usuarios && usuarios.length > 0 ? (
            <pre>{JSON.stringify(usuarios, null, 2)}</pre>
          ) : (
            <p>La tabla está vacía. ¡Es hora de cargar el primer alumno!</p>
          )}
        </div>
      </section>
    </main>
  )
}