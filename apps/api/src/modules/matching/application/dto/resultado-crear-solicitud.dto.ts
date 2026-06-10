import { SolicitudIntercambioResponseDto } from './solicitud-intercambio-response.dto';
import { PropuestaResponseDto }            from './propuesta-response.dto';

export class ResultadoCrearSolicitudDto {
    solicitud!: SolicitudIntercambioResponseDto;
    propuesta!: PropuestaResponseDto | null;
}
