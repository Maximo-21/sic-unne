import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // ─── 1. ROLES ───────────────────────────────────────────────────────────────
    await prisma.rol.createMany({
        data: [
            { id_rol: 1, descripcion: 'estudiante' },
            { id_rol: 2, descripcion: 'admin' },
        ],
        skipDuplicates: true,
    });
    console.log('✓ Roles sembrados.');

    // ─── 2. ADMINISTRADOR INICIAL ────────────────────────────────────────────────
    const claveHasheada = await bcrypt.hash('Admin1234', 10);

    await prisma.usuario.upsert({
        where:  { dni: '00000001' },
        update: {},
        create: {
            dni:        '00000001',
            nombre:     'Admin',
            apellido:   'Sistema',
            email:      'admin@sic-unne.edu.ar',
            contrasena: claveHasheada,
            carrera:    null,
            estado:     'activo',
            id_rol:     2,
        },
    });
    console.log('✓ Administrador creado.  DNI: 00000001 / Contraseña: Admin1234');

    // ─── 2.5. USUARIOS ESTUDIANTES DE PRUEBA ─────────────────────────────────────
    const estudiantes = [
        { dni: '40123456', nombre: 'Juan', apellido: 'García', email: 'juan.garcia@student.edu.ar', carrera: 'Ingeniería en Sistemas', clave: 'Est12345' },
        { dni: '41234567', nombre: 'María', apellido: 'López', email: 'maria.lopez@student.edu.ar', carrera: 'Ingeniería en Sistemas', clave: 'Est12345' },
        { dni: '42345678', nombre: 'Carlos', apellido: 'Rodríguez', email: 'carlos.rodriguez@student.edu.ar', carrera: 'Informática', clave: 'Est12345' },
        { dni: '43456789', nombre: 'Sofía', apellido: 'Martínez', email: 'sofia.martinez@student.edu.ar', carrera: 'Informática', clave: 'Est12345' },
        { dni: '44567890', nombre: 'Diego', apellido: 'Fernández', email: 'diego.fernandez@student.edu.ar', carrera: 'Ciencias de la Computación', clave: 'Est12345' },
    ];

    for (const est of estudiantes) {
        const claveHasheada = await bcrypt.hash(est.clave, 10);
        await prisma.usuario.upsert({
            where:  { dni: est.dni },
            update: {},
            create: {
                dni:        est.dni,
                nombre:     est.nombre,
                apellido:   est.apellido,
                email:      est.email,
                contrasena: claveHasheada,
                carrera:    est.carrera,
                estado:     'activo',
                id_rol:     1,
            },
        });
        console.log(`  · ${est.nombre} ${est.apellido} (${est.dni}) — Estudiante creado.`);
    }
    console.log('✓ Estudiantes sembrados (5).');

    // ─── 3. ASIGNATURAS, COMISIONES Y HORARIOS ───────────────────────────────────
    // Guard: si ya existen asignaturas no se vuelve a correr este bloque.
    if (await prisma.asignatura.count() > 0) {
        console.log('· Asignaturas/comisiones/horarios ya existen — omitidos.');
        return;
    }

    const asignaturas = [
        { nombre_asignatura: 'Ingeniería de Software II', anio_asignatura: '3°' },
        { nombre_asignatura: 'Economía Aplicada',         anio_asignatura: '3°' },
        { nombre_asignatura: 'Teoría de la Computación',  anio_asignatura: '3°' },
        { nombre_asignatura: 'Inglés Técnico',            anio_asignatura: '1°' },
    ];

    for (const datos of asignaturas) {
        const asignatura = await prisma.asignatura.create({
            data: datos,
        });

        // Comisión 1 — turno mañana (Lunes y Miércoles 08:00–10:00)
        const manana = await prisma.comision.create({
            data: { nombre_comision: 'Comisión 1', id_asignatura: asignatura.id_asignatura },
        });

        await prisma.horario.createMany({
            data: [
                { dia: 'Lunes',     hora_desde: '08:00', hora_hasta: '10:00', modalidad: 'Presencial', id_comision: manana.id_comision },
                { dia: 'Miércoles', hora_desde: '08:00', hora_hasta: '10:00', modalidad: 'Presencial', id_comision: manana.id_comision },
            ],
        });

        // Comisión 2 — turno tarde (Martes y Jueves 18:00–20:00)
        const tarde = await prisma.comision.create({
            data: { nombre_comision: 'Comisión 2', id_asignatura: asignatura.id_asignatura },
        });

        await prisma.horario.createMany({
            data: [
                { dia: 'Martes', hora_desde: '18:00', hora_hasta: '20:00', modalidad: 'Presencial', id_comision: tarde.id_comision },
                { dia: 'Jueves', hora_desde: '18:00', hora_hasta: '20:00', modalidad: 'Presencial', id_comision: tarde.id_comision },
            ],
        });

        console.log(`  · ${datos.nombre_asignatura} — Comisión 1 y Comisión 2 creadas.`);
    }

    console.log('✓ Asignaturas sembradas (4).');
    console.log('✓ Comisiones sembradas (8).');
    console.log('✓ Horarios sembrados (16).');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
