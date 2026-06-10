export class Inscripcion {
    constructor(
        public readonly id:               number,
        public readonly estado:           string,
        public readonly fechaInscripcion: Date | null,
        public readonly idComision:       number,
        public readonly idUsuario:        string,
        public readonly nombreComision:   string | null,
        public readonly nombreAsignatura: string | null,
    ) { }

    estaActiva(): boolean {
        return this.estado === 'activa';
    }

    puedeParticiparEnIntercambio(): boolean {
        return this.estaActiva();
    }

    perteneceAUsuario(idUsuario: string): boolean {
        return this.idUsuario === idUsuario;
    }
}
