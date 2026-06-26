import { IsIn } from 'class-validator';

export class VotarPropuestaDto {
    @IsIn(['aceptado', 'rechazado'])
    voto!: 'aceptado' | 'rechazado';
}
