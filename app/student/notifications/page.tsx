export default function NotificationsPage() {
  const notices = [
    { id: 1, title: 'Permuta Aceptada', body: 'Tu solicitud para Análisis Matemático II ha sido aprobada por el otro alumno.', time: 'Hace 2 horas', priority: 'high' },
    { id: 2, title: 'Recordatorio', body: 'El periodo de intercambios finaliza este viernes a las 20:00 hs.', time: 'Hace 1 día', priority: 'normal' },
  ]

  return (
    <div className="animate-in fade-in duration-700 font-body max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Notificaciones</h1>
        <p className="text-zinc-400 text-sm font-medium">Avisos del sistema y novedades de tus solicitudes.</p>
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n.id} className={`p-6 rounded-3xl border transition-all ${
            n.priority === 'high' ? 'bg-primary-unne/5 border-primary-unne/10' : 'bg-white border-zinc-100'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-zinc-900">{n.title}</h3>
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{n.time}</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}