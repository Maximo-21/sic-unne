"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Usuario } from '@/types/user' // Importamos la interface que tradujimos

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // 1. Estado para almacenar los datos del alumno logueado
  const [alumno, setAlumno] = useState<Usuario | null>(null)

  // 2. Efecto para cargar los datos del localStorage al montar el componente
  useEffect(() => {
    const datosGuardados = localStorage.getItem('usuario_sic')
    if (datosGuardados) {
      setAlumno(JSON.parse(datosGuardados))
    } else {
      // Si no hay datos, por seguridad lo mandamos al login
      router.push('/')
    }
  }, [router])

  // 🗺️ Diccionario de traducción para el Header
  const mapaRutas: { [key: string]: string } = {
    'commissions': 'Mis Comisiones',
    'history': 'Mi Historial',
    'notifications': 'Notificaciones',
  }

  const segmento = pathname.split('/').pop() || ''
  const nombreTraducido = mapaRutas[segmento] || segmento

  const menuEstudiante = [
    { name: 'Mis Comisiones', icon: 'hub', path: '/student/commissions' },
    { name: 'Mi Historial', icon: 'receipt_long', path: '/student/history' },
    { name: 'Notificaciones', icon: 'notifications', path: '/student/notifications' },
  ]

  // Función para cerrar sesión y limpiar datos
  const cerrarSesion = () => {
    localStorage.removeItem('usuario_sic')
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-transparent font-body">
      <aside className="w-72 bg-primary-unne hidden lg:flex flex-col text-white p-8 z-20 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black">UNNE</div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xl tracking-tight leading-none">Panel Alumno</span>
            <span className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-1 italic">Exactas - SIC</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuEstudiante.map((item) => {
            const estaActivo = pathname === item.path
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all border ${
                  estaActivo 
                  ? 'bg-white/10 border-white/20 shadow-lg text-white' 
                  : 'text-white/50 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5">
          <button 
            onClick={cerrarSesion} 
            className="w-full p-4 text-white/40 hover:text-white flex items-center gap-4 font-bold text-sm transition-colors"
          >
            <span className="material-symbols-outlined">logout</span> 
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col z-10">
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Vista Alumno / <span className="text-primary-unne">{nombreTraducido}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              {/* 🟢 DINÁMICO: Mostramos nombre y apellido del estado */}
              <p className="text-xs font-black text-zinc-900 uppercase">
                {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Cargando...'}
              </p>
              <p className="text-[9px] font-bold text-primary-unne uppercase tracking-tighter">
                {alumno?.rol === 'estudiante' ? 'Estudiante de Sistemas' : 'Usuario UNNE'}
              </p>
            </div>
            <div className="w-10 h-10 bg-zinc-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
              {/* Avatar con iniciales si no hay foto */}
              <span className="text-xs font-bold text-zinc-400 uppercase">
                {alumno ? `${alumno.nombre[0]}${alumno.apellido[0]}` : <span className="material-symbols-outlined">person</span>}
              </span>
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  )
}