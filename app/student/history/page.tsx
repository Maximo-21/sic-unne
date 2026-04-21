export default function StudentHistoryPage() {
  const history = [
    { id: 1, date: '20/04/2026', subject: 'Análisis Matemático II', type: 'Permuta Directa', status: 'Pendiente', details: 'De C1 a C3' },
    { id: 2, date: '15/03/2026', subject: 'Programación I', type: 'Cambio de Cupo', status: 'Aprobado', details: 'De C2 a C1' },
    { id: 3, date: '10/03/2026', subject: 'Álgebra', type: 'Permuta Directa', status: 'Rechazado', details: 'De C4 a C2' },
  ]

  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Historial de Trámites</h1>
        <p className="text-zinc-400 text-sm font-medium">Seguimiento de tus solicitudes de intercambio y permutas.</p>
      </div>

      <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5">Asignatura</th>
              <th className="px-8 py-5">Tipo</th>
              <th className="px-8 py-5">Detalle</th>
              <th className="px-8 py-5 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50/30 transition-colors">
                <td className="px-8 py-6 text-xs font-mono text-zinc-400">{item.date}</td>
                <td className="px-8 py-6 font-bold text-zinc-900">{item.subject}</td>
                <td className="px-8 py-6 text-sm text-zinc-500">{item.type}</td>
                <td className="px-8 py-6 text-xs italic text-zinc-400">{item.details}</td>
                <td className="px-8 py-6 text-right">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                    item.status === 'Aprobado' ? 'bg-green-50 text-green-600 border-green-100' : 
                    item.status === 'Rechazado' ? 'bg-red-50 text-red-600 border-red-100' : 
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}