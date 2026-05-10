# 🎓 SIC-UNNE — Sistema de Asignación por Matching

### **Descripción del Proyecto**

Este proyecto desarrolla una solución tecnológica para la **asignación de alumnos a comisiones** en la UNNE, utilizando un algoritmo de **Matching**. El objetivo es sustituir la inscripción tradicional por una distribución inteligente que optimice los cupos y respete las prioridades académicas de los estudiantes.

---

### **Funcionalidades Principales**

* **Algoritmo de Matching:** El motor central del sistema que realiza el emparejamiento entre la disponibilidad de comisiones y las solicitudes de los alumnos.
* **Gestión de Usuarios (CRUD):** Módulo para el registro, edición y consulta de los datos de los estudiantes que participarán en el proceso.
* **Simulación de Entorno:** Integración de datos simulados de comisiones y materias para validar la eficiencia del algoritmo de asignación.

---

### **🛠️ Tecnologías y Herramientas**

* **Frontend:** Next.js 14/15 + TypeScript.
* **Backend & DB:** Supabase (PostgreSQL).
* **Lógica de Matching:** Implementada en TypeScript/Node.js.

---

### **📂 Estructura del Repositorio**

* **`/app`**: Contiene las páginas y rutas de la aplicación.
* **`/components`**: Componentes de la interfaz para el registro de usuarios y visualización de resultados.
* **`/services`**: Lógica de comunicación con **Supabase** para el CRUD de usuarios.
* **`/types`**: Definiciones de interfaces para asegurar la consistencia de los datos.
* **`/BDD`**: Esquemas y sentencias **SQL** para la estructura de la base de datos.