"use client"
import LoginForm from '@/components/auth/LoginForm'
import { useRouter } from 'next/navigation'

export default function Home() {
  const enrutador = useRouter()

  const gestionarExitoLogin = (usuario: any) => {
    localStorage.setItem('usuario_sic', JSON.stringify(usuario));
    // 🔍 El rol viene de tu DB (rol: 'admin' o 'estudiante')
    if (usuario.rol === 'admin') {
      enrutador.push('/dashboard/users') 
    } else {
      // 🚀 Lo mandamos a la raíz del portal de alumnos
      // Recordá que debe coincidir con el nombre de tu carpeta: 'student'
      enrutador.push('/student/commissions') 
    }
  }

  // Usamos la prop traducida que definimos en el LoginForm
  return <LoginForm alIniciarSesionExito={gestionarExitoLogin} />
}