import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearSolicitudDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idComisionOrigen!: number;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idComisionDestino!: number;
}
