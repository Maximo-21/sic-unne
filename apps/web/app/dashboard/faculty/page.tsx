export default function FacultyPage() {
  return (
    <div className="animate-in fade-in duration-700 font-body">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-primary-unne tracking-tighter uppercase">Facultad de Exactas</h1>
        <p className="text-zinc-400 text-sm font-medium">Información institucional y autoridades.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-primary-unne rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 relative z-10">Ciencias Exactas y Naturales y Agrimensura</h2>
            <p className="text-white/60 font-medium max-w-lg relative z-10">Sede central Corrientes, Argentina. Campus Universitario Deodoro Roca.</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-8">
             <h3 className="font-black text-zinc-900 uppercase text-xs tracking-widest mb-6">Autoridades 2026</h3>
             <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-50">
                   <p className="font-bold text-zinc-700">Decano</p>
                   <p className="font-medium text-zinc-400">Dr. Viviana Godoy Guglielmone</p>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-zinc-50">
                   <p className="font-bold text-zinc-700">Vicedecano</p>
                   <p className="font-medium text-zinc-400">Mag. Mario Roberto Urbani</p>
                </div>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white border border-zinc-200 rounded-3xl p-8 h-fit">
          <h3 className="font-black text-zinc-900 uppercase text-xs tracking-widest mb-6">Contacto</h3>
          <div className="space-y-4">
             <div className="flex items-center gap-4 text-zinc-500">
                <span className="material-symbols-outlined text-primary-unne">location_on</span>
                <p className="text-xs font-medium">Av. Libertad 5470, Corrientes</p>
             </div>
             <div className="flex items-center gap-4 text-zinc-500">
                <span className="material-symbols-outlined text-primary-unne">mail</span>
                <p className="text-xs font-medium">info@exa.unne.edu.ar</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}