import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearInscripcionDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idComision!: number;
}
