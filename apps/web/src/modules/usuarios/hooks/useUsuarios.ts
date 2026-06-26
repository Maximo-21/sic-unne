import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { confirmarConToast } from '@shared/utils/toastConfirm'
import { UsuariosServicio } from '../services/UsuariosServicio'
import { Usuario } from '../types/Usuario'

export function useUsuarios(claveRecarga: number = 0) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const data = await UsuariosServicio.obtenerTodos()
      setUsuarios(data)
    } catch (err: unknown) {
      console.error('Error obteniendo usuarios:', err instanceof Error ? err.message : err)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [claveRecarga, cargar])

  const cambiarEstado = async (usuario: Usuario, onCambio: () => void) => {
    const estaActivo = usuario.estado === 'activo'
    const accion = estaActivo ? 'desactivar' : 'activar'
    const confirmado = await confirmarConToast(
      `¿Desea ${accion} al usuario ${usuario.nombre}?`
    )
    if (!confirmado) return

    setCargando(true)
    try {
      if (estaActivo) {
        await UsuariosServicio.darDeBaja(usuario.id_usuario!)
        toast.success(`Usuario ${usuario.nombre} desactivado.`)
      } else {
        await UsuariosServicio.activar(usuario.id_usuario!)
        toast.success(`Usuario ${usuario.nombre} activado.`)
      }
      onCambio()
    } catch (err: unknown) {
      toast.error('No se pudo cambiar el estado: ' + (err instanceof Error ? err.message : 'Error inesperado'))
      setCargando(false)
    }
  }

  return { usuarios, cargando, cargar, cambiarEstado }
}
