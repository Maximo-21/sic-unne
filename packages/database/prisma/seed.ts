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

        console.log(`  · ${nombre} — Comisión 1 y Comisión 2 creadas.`);
    }

    console.log('✓ Asignaturas sembradas (4).');
    console.log('✓ Comisiones sembradas (8).');
    console.log('✓ Horarios sembrados (16).');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
