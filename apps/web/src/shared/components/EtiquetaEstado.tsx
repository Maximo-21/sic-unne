interface Props {
  estado: string | null | undefined;
}

const estilos: Record<string, string> = {
  activo: 'bg-green-50 text-green-700 border-green-100',
  inactivo: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  aceptada: 'bg-green-50 text-green-700 border-green-100',
  rechazada: 'bg-red-50 text-red-500 border-red-100',
  cancelada: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}

export default function EtiquetaEstado({ estado }: Props) {
  const clases = estilos[estado ?? ''] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${clases}`}>
      {estado ?? '-'}
    </span>
  )
}
