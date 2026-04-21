export const userSchema = {
  /**
   * 1. Valida que todos los campos obligatorios tengan contenido.
   * IMPORTANTE: Los nombres de los campos deben coincidir con tu objeto 'userData'
   */
  validateRequired: (data: any) => {
    // Usamos los nombres de columnas de tu Supabase
    const fields = ['dni', 'nombre', 'apellido', 'email'];
    return fields.every(field => {
      const value = data[field];
      return value !== undefined && value !== null && String(value).trim() !== '';
    });
  },

  /**
   * 2. Solo letras y espacios. Bloquea números y caracteres especiales.
   */
  validateName: (text: string) => {
    if (!text) return false;
    // Agregué el trim() para que no de error si el usuario puso un espacio al final por error
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(text.trim());
  },
  
  /**
   * 3. Solo números, de 7 a 9 dígitos (Regla de DNI Argentino).
   */
  validateDNI: (dni: string) => {
    if (!dni) return false;
    return /^\d{7,9}$/.test(dni.trim());
  },
  
  /**
   * 4. Formato de email con @ y punto.
   */
  validateEmail: (email: string) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  },

 
};