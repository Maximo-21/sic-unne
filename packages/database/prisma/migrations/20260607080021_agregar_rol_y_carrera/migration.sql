-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "carrera" TEXT,
    "estado" TEXT DEFAULT 'activo',
    "fecha_registro" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_descripcion_key" ON "roles"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_dni_key" ON "usuarios"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;
