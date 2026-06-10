import { SolicitudIntercambioResponseDto } from './SolicitudIntercambioResponseDto';
import { PropuestaResponseDto }            from './PropuestaResponseDto';

export class ResultadoCrearSolicitudDto {
    solicitud!: SolicitudIntercambioResponseDto;
    propuesta!: PropuestaResponseDto | null;
}
