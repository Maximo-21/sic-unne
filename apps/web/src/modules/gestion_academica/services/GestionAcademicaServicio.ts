import { clienteAPI } from '@shared/services/ClienteAPI';
import { Asignatura } from '../types/Asignatura';
import { Comision } from '../types/Comision';
import { Horario } from '../types/Horario';
import { Inscripcion } from '../types/Inscripcion';

/**
 * Servicio frontend para el módulo de Gestión Académica.
 * Encapsula todas las llamadas a `/academico` en la API backend.
 *
 * Implementa HU2 (consultar datos académicos) y la inscripción de HU3.
 */
export const GestionAcademicaServicio = {
  /** Retorna todas las asignaturas disponibles en el sistema. */
  async obtenerAsignaturas(): Promise<Asignatura[]> {
    const r = await clienteAPI.obtener<{ data: Asignatura[] }>('/academico/asignaturas');
    return r.data;
  },

  /**
   * Retorna las comisiones disponibles, opcionalmente filtradas por asignatura.
   * @param idAsignatura — si se omite, retorna todas las comisiones
   */
  async obtenerComisiones(idAsignatura?: number): Promise<Comision[]> {
    const ruta = idAsignatura
      ? `/academico/comisiones?idAsignatura=${idAsignatura}`
      : '/academico/comisiones';
    const r = await clienteAPI.obtener<{ data: Comision[] }>(ruta);
    return r.data;
  },

  /**
   * Retorna los horarios, opcionalmente filtrados por comisión.
   * @param idComision — si se omite, retorna todos los horarios
   */
  async obtenerHorarios(idComision?: number): Promise<Horario[]> {
    const ruta = idComision
      ? `/academico/horarios?idComision=${idComision}`
      : '/academico/horarios';
    const r = await clienteAPI.obtener<{ data: Horario[] }>(ruta);
    return r.data;
  },

  /**
   * Inscribe al alumno autenticado en la comisión indicada (HU2 → HU3).
   * @param idComision — id de la comisión destino
   */
  async inscribirse(idComision: number): Promise<Inscripcion> {
    const r = await clienteAPI.post<{ data: Inscripcion }>('/academico/inscripciones', { idComision });
    return r.data;
  },

  /** Retorna las inscripciones activas del alumno autenticado. */
  async obtenerMisInscripciones(): Promise<Inscripcion[]> {
    const r = await clienteAPI.obtener<{ data: Inscripcion[] }>('/academico/inscripciones/me');
    return r.data;
  },

  /** Retorna todas las inscripciones del sistema (requiere rol admin). */
  async obtenerTodasInscripciones(): Promise<Inscripcion[]> {
    const r = await clienteAPI.obtener<{ data: Inscripcion[] }>('/academico/inscripciones');
    return r.data;
  },
};
