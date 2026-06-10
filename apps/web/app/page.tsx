"use client"
import LoginForm from '@/modules/auth/components/LoginForm'
import { useRouter } from 'next/navigation'

export default function Home() {
  const enrutador = useRouter()

  const gestionarExitoLogin = (usuario: any) => {
    if (usuario.rol_descripcion === 'admin') {
      enrutador.push('/dashboard/users')
    } else {
      enrutador.push('/student/commissions')
    }
  }

  return <LoginForm alIniciarSesionExito={gestionarExitoLogin} />
}
