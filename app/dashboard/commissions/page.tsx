export default function CommissionsPage() {
  const commissions = [
    { id: 1, subject: 'Análisis Matemático II', code: 'MA-202', comm: 'C1', students: 45, max: 50, status: 'Normal' },
    { id: 2, subject: 'Programación II', code: 'PR-105', comm: 'C3', students: 58, max: 60, status: 'Crítico' },
    { id: 3, subject: 'Sistemas Operativos', code: 'SO-301', comm: 'C1', students: 30, max: 40, status: 'Normal' },
    { id: 4, subject: 'Base de Datos I', code: 'BD-204', comm: 'C2', students: 60, max: 60, status: 'Lleno' },
  ]

  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">Control de Comisiones</h1>
        <p className="text-zinc-400 text-sm font-medium">Monitoreo de cupos y alumnos inscriptos por comisión.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Asignatura</th>
              <th className="px-8 py-5">Comisión</th>
              <th className="px-8 py-5">Inscriptos</th>
              <th className="px-8 py-5">Estado de Cupo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {commissions.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/30 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-bold text-zinc-900 leading-none">{c.subject}</p>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1 inline-block">Código: {c.code}</span>
                </td>
                <td className="px-8 py-6 font-black text-primary-unne">{c.comm}</td>
                <td className="px-8 py-6 text-sm font-medium text-zinc-500">
                  {c.students} / <span className="text-zinc-300">{c.max}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 text-[9px] font-black rounded-lg border uppercase ${
                    c.status === 'Lleno' ? 'bg-red-50 text-red-600 border-red-100' : 
                    c.status === 'Crítico' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {c.status}
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