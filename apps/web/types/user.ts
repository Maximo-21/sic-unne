export interface Usuario {
  id_usuario?: string; // El signo '?' indica que es opcional porque Supabase lo genera solo
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  contraseña?: string;
  rol: 'estudiante' | 'admin'; // Usamos estos valores fijos para evitar errores de escritura
  estado: 'activo' | 'inactivo';
  fecha_registro?: string; // Opcional, por si la base de datos guarda la fecha automáticamente
}