-- =============================================================================
-- 1. PROCEDIMIENTO: ejecutar_intercambio
--    Ejecuta el intercambio de comisiones entre dos alumnos de forma atómica.
--    Actualiza las inscripciones, las solicitudes y la propuesta en una sola
--    transacción; ante cualquier error hace rollback automático.
--    Llamada desde NestJS: CALL ejecutar_intercambio($1::integer)
-- =============================================================================

CREATE OR REPLACE PROCEDURE ejecutar_intercambio(p_id_propuesta INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_solicitud_1     INTEGER;
    v_id_solicitud_2     INTEGER;
    v_id_usuario_1       UUID;
    v_id_usuario_2       UUID;
    v_comision_origen_1  INTEGER;
    v_comision_destino_1 INTEGER;
    v_comision_origen_2  INTEGER;
    v_comision_destino_2 INTEGER;
    v_estado_propuesta   TEXT;
BEGIN
    -- ── 1. Bloquear y verificar que la propuesta existe y está pendiente ──────
    SELECT estado_general
    INTO   v_estado_propuesta
    FROM   "Propuesta"
    WHERE  id_propuesta = p_id_propuesta
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Propuesta % no encontrada.', p_id_propuesta;
    END IF;

    IF v_estado_propuesta <> 'pendiente' THEN
        RAISE EXCEPTION
            'La propuesta % no está en estado pendiente (estado actual: %).',
            p_id_propuesta, v_estado_propuesta;
    END IF;

    -- ── 2. Leer los datos de las dos solicitudes vinculadas ───────────────────
    SELECT  p.id_solicitud_1,    p.id_solicitud_2,
            s1.id_usuario,       s1.id_comision_origen,  s1.id_comision_destino,
            s2.id_usuario,       s2.id_comision_origen,  s2.id_comision_destino
    INTO    v_id_solicitud_1,    v_id_solicitud_2,
            v_id_usuario_1,      v_comision_origen_1,    v_comision_destino_1,
            v_id_usuario_2,      v_comision_origen_2,    v_comision_destino_2
    FROM    "Propuesta"              p
    JOIN    "Solicitud_Intercambio"  s1 ON s1.id_solicitud = p.id_solicitud_1
    JOIN    "Solicitud_Intercambio"  s2 ON s2.id_solicitud = p.id_solicitud_2
    WHERE   p.id_propuesta = p_id_propuesta;

    -- ── 3. Verificar que existen inscripciones activas para ambos alumnos ─────
    IF NOT EXISTS (
        SELECT 1 FROM "Inscripcion"
        WHERE  id_usuario  = v_id_usuario_1
          AND  id_comision = v_comision_origen_1
          AND  estado      = 'activa'
    ) THEN
        RAISE EXCEPTION
            'No existe inscripción activa para el alumno 1 en la comisión % .',
            v_comision_origen_1;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM "Inscripcion"
        WHERE  id_usuario  = v_id_usuario_2
          AND  id_comision = v_comision_origen_2
          AND  estado      = 'activa'
    ) THEN
        RAISE EXCEPTION
            'No existe inscripción activa para el alumno 2 en la comisión % .',
            v_comision_origen_2;
    END IF;

    -- ── 4. Intercambiar comisiones (estado permanece 'activa') ────────────────
    UPDATE "Inscripcion"
    SET    id_comision = v_comision_destino_1
    WHERE  id_usuario  = v_id_usuario_1
      AND  id_comision = v_comision_origen_1
      AND  estado      = 'activa';

    UPDATE "Inscripcion"
    SET    id_comision = v_comision_destino_2
    WHERE  id_usuario  = v_id_usuario_2
      AND  id_comision = v_comision_origen_2
      AND  estado      = 'activa';

    -- ── 5. Cerrar las solicitudes ─────────────────────────────────────────────
    UPDATE "Solicitud_Intercambio"
    SET    estado = 'aceptada'
    WHERE  id_solicitud IN (v_id_solicitud_1, v_id_solicitud_2);

    -- ── 6. Cerrar la propuesta y registrar la fecha del intercambio ───────────
    UPDATE "Propuesta"
    SET    estado_general = 'aceptada',
           fecha_match    = NOW()
    WHERE  id_propuesta   = p_id_propuesta;

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;


-- =============================================================================
-- 2. FUNCIÓN DE CONSULTA: buscar_espejos_disponibles
--    Devuelve todas las Solicitud_Intercambio en estado 'pendiente' que sean
--    el espejo exacto de la solicitud del alumno que consulta:
--      - su id_comision_origen  == p_id_comision_destino  (tiene lo que yo quiero)
--      - su id_comision_destino == p_id_comision_origen   (quiere lo que yo tengo)
--    Excluye al propio usuario para evitar auto-coincidencias.
--    Llamada desde NestJS:
--      SELECT * FROM buscar_espejos_disponibles($1::int, $2::int, $3::uuid)
-- =============================================================================

CREATE OR REPLACE FUNCTION buscar_espejos_disponibles(
    p_id_comision_origen  INTEGER,
    p_id_comision_destino INTEGER,
    p_id_usuario_excluido UUID
)
RETURNS TABLE (
    id_solicitud        INTEGER,
    estado              TEXT,
    fecha_creacion      TIMESTAMPTZ,
    id_usuario          UUID,
    id_comision_origen  INTEGER,
    id_comision_destino INTEGER
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        s.id_solicitud,
        s.estado,
        s.fecha_creacion,
        s.id_usuario,
        s.id_comision_origen,
        s.id_comision_destino
    FROM  "Solicitud_Intercambio" s
    WHERE s.estado               = 'pendiente'
      AND s.id_comision_origen   = p_id_comision_destino   -- tiene lo que yo quiero
      AND s.id_comision_destino  = p_id_comision_origen    -- quiere lo que yo tengo
      AND s.id_usuario          <> p_id_usuario_excluido;
$$;
