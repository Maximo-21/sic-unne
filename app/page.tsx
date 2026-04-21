"use client"
import LoginForm from '@/components/auth/LoginForm'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleLoginSuccess = (user: any) => {
    // 🔍 El rol viene de tu DB (rol: 'admin' o 'estudiante')
    if (user.rol === 'admin') {
      router.push('/dashboard/users') 
    } else {
      // 🚀 Lo mandamos a la raíz del portal de alumnos
      // Recordá que debe coincidir con el nombre de tu carpeta: 'student'
      router.push('/student/commissions') 
    }
  }

  return <LoginForm onLoginSuccess={handleLoginSuccess} />
}