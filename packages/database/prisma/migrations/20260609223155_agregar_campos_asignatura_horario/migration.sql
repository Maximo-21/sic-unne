-- AlterTable: agregar anio_asignatura con default temporal para filas existentes
ALTER TABLE "Asignatura" ADD COLUMN "anio_asignatura" TEXT NOT NULL DEFAULT 'Sin especificar';
ALTER TABLE "Asignatura" ALTER COLUMN "anio_asignatura" DROP DEFAULT;

-- AlterTable: agregar modalidad con default temporal para filas existentes
ALTER TABLE "Horario" ADD COLUMN "modalidad" TEXT NOT NULL DEFAULT 'Presencial';
ALTER TABLE "Horario" ALTER COLUMN "modalidad" DROP DEFAULT;
