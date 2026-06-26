import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    readonly dni!:  string;

    @IsString()
    @IsNotEmpty()
    readonly clave!: string;
}
