export class SolicitudIntercambio {
    constructor(
        public readonly id:                    number,
        public readonly estado:                string,
        public readonly fechaCreacion:         Date | null,
        public readonly idUsuario:             string,
        public readonly idComisionOrigen:      number,
        public readonly idComisionDestino:     number,
        public readonly idAsignaturaOrigen:    number | null,
        public readonly nombreUsuario:         string | null,
        public readonly apellidoUsuario:       string | null,
        public readonly nombreComisionOrigen:  string | null,
        public readonly nombreComisionDestino: string | null,
        public readonly nombreAsignaturaOrigen: string | null,
    ) { }

    estaPendiente(): boolean {
        return this.estado === 'pendiente';
    }

    estaEnPropuesta(): boolean {
        return this.estado === 'en_propuesta';
    }

    puedeCancelarse(): boolean {
        return this.estaPendiente();
    }

    perteneceAUsuario(idUsuario: string): boolean {
        return this.idUsuario === idUsuario;
    }

    esEspejo(otra: SolicitudIntercambio): boolean {
        return (
            this.estaPendiente()                             &&
            otra.estaPendiente()                             &&
            this.idUsuario          !== otra.idUsuario       &&
            this.idComisionOrigen   === otra.idComisionDestino &&
            this.idComisionDestino  === otra.idComisionOrigen
        );
    }
}
