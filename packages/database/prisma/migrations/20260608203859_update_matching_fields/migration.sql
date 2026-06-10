-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "fecha_inscripcion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Propuesta" ADD COLUMN     "estado_alumno_1" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "estado_alumno_2" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "fecha_match" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Solicitud_Intercambio" ADD COLUMN     "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
