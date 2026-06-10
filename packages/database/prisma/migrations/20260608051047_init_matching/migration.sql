-- CreateTable
CREATE TABLE "Asignatura" (
    "id_asignatura" SERIAL NOT NULL,
    "nombre_asignatura" TEXT NOT NULL,

    CONSTRAINT "Asignatura_pkey" PRIMARY KEY ("id_asignatura")
);

-- CreateTable
CREATE TABLE "Comision" (
    "id_comision" SERIAL NOT NULL,
    "nombre_comision" TEXT NOT NULL,
    "id_asignatura" INTEGER NOT NULL,

    CONSTRAINT "Comision_pkey" PRIMARY KEY ("id_comision")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id_horario" SERIAL NOT NULL,
    "dia" TEXT NOT NULL,
    "hora_desde" TEXT NOT NULL,
    "hora_hasta" TEXT NOT NULL,
    "id_comision" INTEGER NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id_inscripcion" SERIAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "id_comision" INTEGER NOT NULL,
    "id_usuario" UUID NOT NULL,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "Solicitud_Intercambio" (
    "id_solicitud" SERIAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "id_usuario" UUID NOT NULL,
    "id_comision_origen" INTEGER NOT NULL,
    "id_comision_destino" INTEGER NOT NULL,

    CONSTRAINT "Solicitud_Intercambio_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "Propuesta" (
    "id_propuesta" SERIAL NOT NULL,
    "estado_general" TEXT NOT NULL DEFAULT 'pendiente',
    "id_solicitud_1" INTEGER NOT NULL,
    "id_solicitud_2" INTEGER NOT NULL,

    CONSTRAINT "Propuesta_pkey" PRIMARY KEY ("id_propuesta")
);

-- AddForeignKey
ALTER TABLE "Comision" ADD CONSTRAINT "Comision_id_asignatura_fkey" FOREIGN KEY ("id_asignatura") REFERENCES "Asignatura"("id_asignatura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_id_comision_fkey" FOREIGN KEY ("id_comision") REFERENCES "Comision"("id_comision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_comision_fkey" FOREIGN KEY ("id_comision") REFERENCES "Comision"("id_comision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Intercambio" ADD CONSTRAINT "Solicitud_Intercambio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Intercambio" ADD CONSTRAINT "Solicitud_Intercambio_id_comision_origen_fkey" FOREIGN KEY ("id_comision_origen") REFERENCES "Comision"("id_comision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Intercambio" ADD CONSTRAINT "Solicitud_Intercambio_id_comision_destino_fkey" FOREIGN KEY ("id_comision_destino") REFERENCES "Comision"("id_comision") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propuesta" ADD CONSTRAINT "Propuesta_id_solicitud_1_fkey" FOREIGN KEY ("id_solicitud_1") REFERENCES "Solicitud_Intercambio"("id_solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propuesta" ADD CONSTRAINT "Propuesta_id_solicitud_2_fkey" FOREIGN KEY ("id_solicitud_2") REFERENCES "Solicitud_Intercambio"("id_solicitud") ON DELETE RESTRICT ON UPDATE CASCADE;
