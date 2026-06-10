export class InscripcionResponseDto {
    id_inscripcion!:    number;
    estado!:            string;
    fecha_inscripcion!: Date | null;
    id_comision!:       number;
    id_usuario!:        string;
    nombre_comision!:   string | null;
    nombre_asignatura!: string | null;
}
