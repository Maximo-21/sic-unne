import { clienteAPI } from '@shared/services/ClienteAPI';
import { Asignatura } from '../types/Asignatura';
import { Comision } from '../types/Comision';
import { Horario } from '../types/Horario';
import { Inscripcion } from '../types/Inscripcion';

export const GestionAcademicaServicio = {
  async obtenerAsignaturas(): Promise<Asignatura[]> {
    const r = await clienteAPI.obtener<{ data: Asignatura[] }>('/academico/asignaturas');
    return r.data;
  },

  async obtenerComisiones(idAsignatura?: number): Promise<Comision[]> {
    const ruta = idAsignatura
      ? `/academico/comisiones?idAsignatura=${idAsignatura}`
      : '/academico/comisiones';
    const r = await clienteAPI.obtener<{ data: Comision[] }>(ruta);
    return r.data;
  },

  async obtenerHorarios(idComision?: number): Promise<Horario[]> {
    const ruta = idComision
      ? `/academico/horarios?idComision=${idComision}`
      : '/academico/horarios';
    const r = await clienteAPI.obtener<{ data: Horario[] }>(ruta);
    return r.data;
  },

  async inscribirse(idComision: number): Promise<Inscripcion> {
    const r = await clienteAPI.post<{ data: Inscripcion }>('/academico/inscripciones', { idComision });
    return r.data;
  },

  async obtenerMisInscripciones(): Promise<Inscripcion[]> {
    const r = await clienteAPI.obtener<{ data: Inscripcion[] }>('/academico/inscripciones/me');
    return r.data;
  },

  async obtenerTodasInscripciones(): Promise<Inscripcion[]> {
    const r = await clienteAPI.obtener<{ data: Inscripcion[] }>('/academico/inscripciones');
    return r.data;
  },
};
