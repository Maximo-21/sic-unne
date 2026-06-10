export class Horario {
    constructor(
        public readonly id_horario:  number,
        public readonly dia:         string,
        public readonly hora_desde:  string,
        public readonly hora_hasta:  string,
        public readonly modalidad:   string,
        public readonly id_comision: number,
    ) { }
}
