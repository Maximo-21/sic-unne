export const esquemaUsuario = {
  // 1. Valida campos obligatorios (incluyendo contraseña para nuevos)
  validarObligatorios: (data: any, esNuevo: boolean) => {
    // Definimos los campos base
    const fields = ['dni', 'nombre', 'apellido', 'email'];
    
    // Si es nuevo, la contraseña TAMBIÉN es obligatoria
    if (esNuevo) fields.push('contraseña');

    return fields.every(field => {
      const value = data[field];
      return value !== undefined && value !== null && String(value).trim() !== '';
    });
  },

  // 2. Solo letras y espacios (Regex mejorada)
  validarNombre: (text: string) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(text.trim()),
  
  // 3. DNI Argentino (7 a 9 dígitos)
  validarDNI: (dni: string) => /^\d{7,9}$/.test(dni.trim()),
  
  // 4. Formato de email
  validarEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),

  // 5. Validación Maestra (Para usar en el Formulario)
  // 5. Validación Maestra (Para usar en el Formulario)
  validarTodo: (data: any, esEdicion: boolean) => {
  // Si esEdicion es true, entonces esNuevo es false
  const esNuevo = !esEdicion; 
  
  if (!esquemaUsuario.validarObligatorios(data, esNuevo)) return "Hay campos vacíos.";
  if (!esquemaUsuario.validarDNI(data.dni)) return "El DNI debe tener entre 7 y 9 números.";
  if (!esquemaUsuario.validarNombre(data.nombre)) return "Nombre inválido (solo letras).";
  if (!esquemaUsuario.validarNombre(data.apellido)) return "Apellido inválido (solo letras).";
  if (!esquemaUsuario.validarEmail(data.email)) return "Formato de correo electrónico inválido.";
  return null; // Todo OK
  }
};