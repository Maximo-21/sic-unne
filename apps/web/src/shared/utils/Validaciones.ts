export class Validaciones {
  // 1. Valida campos obligatorios
  static validarObligatorios(data: any, esNuevo: boolean): boolean {
    const fields = ['dni', 'nombre', 'apellido', 'email', 'rol'];

    if (esNuevo) fields.push('contraseña');

    return fields.every(field => {
      const value = data[field];
      return value !== undefined && value !== null && String(value).trim() !== '';
    });
  }

  // 2. Solo letras y espacios
  static validarNombre(text: string): boolean {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(text.trim());
  }

  // 3. DNI Argentino (7 a 9 dígitos)
  static validarDNI(dni: string): boolean {
    return /^\d{7,9}$/.test(dni.trim());
  }

  // 4. Formato de email
  static validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  // 5. Validación Maestra
  static validarTodo(data: any, esEdicion: boolean): string | null {
    const esNuevo = !esEdicion;

    if (!this.validarObligatorios(data, esNuevo)) return "Hay campos vacíos.";
    if (!this.validarDNI(data.dni)) return "El DNI debe tener entre 7 y 9 números.";
    if (!this.validarNombre(data.nombre)) return "Nombre inválido (solo letras).";
    if (!this.validarNombre(data.apellido)) return "Apellido inválido (solo letras).";
    if (!this.validarEmail(data.email)) return "Formato de correo electrónico inválido.";

    return null; // Todo OK
  }
}