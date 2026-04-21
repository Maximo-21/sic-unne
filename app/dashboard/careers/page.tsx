export default function CareersPage() {
  const careers = [
    { id: 1, name: 'Ingeniería en Sistemas de Información', degree: 'Grado', duration: '5 años', dept: 'Informática' },
    { id: 2, name: 'Licenciatura en Ciencias Químicas', degree: 'Grado', duration: '5 años', dept: 'Química' },
    { id: 3, name: 'Licenciatura en Sistemas de Información', degree: 'Grado', duration: '5 años', dept: 'Informática' },
    { id: 4, name: 'Profesorado en Física', degree: 'Grado', duration: '4 años', dept: 'Física' },
  ]

  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">Oferta Académica</h1>
        <p className="text-zinc-400 text-sm font-medium">Carreras y departamentos de la Facultad de Exactas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map((career) => (
          <div key={career.id} className="bg-white border border-zinc-200 rounded-3xl p-8 hover:border-primary-unne/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary-unne/5 rounded-2xl flex items-center justify-center text-primary-unne group-hover:bg-primary-unne group-hover:text-white transition-all">
                <span className="material-symbols-outlined">school</span>
              </div>
              <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{career.degree}</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-zinc-900 mb-2 leading-tight">{career.name}</h3>
            <div className="flex gap-4 mt-6 pt-6 border-t border-zinc-50">
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Departamento</p>
                <p className="text-xs font-bold text-zinc-600">{career.dept}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Duración</p>
                <p className="text-xs font-bold text-zinc-600">{career.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}