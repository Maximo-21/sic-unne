export default function GlobalHistoryPage() {
  const globalLogs = [
    { id: 1, date: '21/04/2026', user: 'Riveros, Máximo', action: 'Permuta Exitosa', detail: 'Análisis II: C1 ➔ C3', status: 'Finalizado' },
    { id: 2, date: '21/04/2026', user: 'Gómez, Ana', action: 'Solicitud Cambio', detail: 'Programación: C2 ➔ C1', status: 'En Proceso' },
    { id: 3, date: '20/04/2026', user: 'Admin (Sistema)', action: 'Alta de Usuario', detail: 'DNI: 45.123.456', status: 'Auditado' },
  ]

  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">Historial Global</h1>
        <p className="text-zinc-400 text-sm font-medium">Registro de movimientos, intercambios y auditoría.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5">Usuario</th>
              <th className="px-8 py-5">Acción</th>
              <th className="px-8 py-5">Detalle</th>
              <th className="px-8 py-5 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {globalLogs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50/30 transition-colors text-sm">
                <td className="px-8 py-5 font-mono text-xs text-zinc-400">{log.date}</td>
                <td className="px-8 py-5 font-bold text-zinc-700">{log.user}</td>
                <td className="px-8 py-5">
                  <span className="px-2 py-1 bg-zinc-100 text-zinc-500 text-[9px] font-black rounded-md uppercase">
                    {log.action}
                  </span>
                </td>
                <td className="px-8 py-5 text-zinc-500 italic text-xs">{log.detail}</td>
                <td className="px-8 py-5 text-right font-black text-[10px] uppercase text-primary-unne">
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}