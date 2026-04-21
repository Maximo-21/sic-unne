export default function StudentCommissionsPage() {
  const allCommissions = [
    { id: 1, subject: 'Ingeniería de Software II', code: 'ING-101', comm: 'C1', shift: 'Mañana', slots: '5 lugares' },
    { id: 2, subject: 'Economia Aplicada', code: 'EC-101', comm: 'C2', shift: 'Tarde', slots: 'Lleno' },
    { id: 3, subject: 'Teoria de Computacion', code: 'TC-101', comm: 'C1', shift: 'Mañana', slots: '12 lugares' },
  ]

  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Explorar Comisiones</h1>
        <p className="text-zinc-400 text-sm font-medium">Consulta la oferta horaria vigente en la Facultad de Exactas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCommissions.map((c) => (
          <div key={c.id} className="bg-white border border-zinc-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-primary-unne/5 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-primary-unne bg-primary-unne/5 px-2 py-1 rounded-lg uppercase tracking-widest">{c.code}</span>
              <span className={`text-[9px] font-black uppercase ${c.slots === 'Lleno' ? 'text-red-400' : 'text-green-500'}`}>
                {c.slots}
              </span>
            </div>
            <h3 className="font-headline font-bold text-lg text-zinc-900 mb-4">{c.subject}</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 uppercase">
               <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">groups</span> {c.comm}</div>
               <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {c.shift}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}