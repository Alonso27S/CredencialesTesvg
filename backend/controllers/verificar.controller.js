import { pool } from "../db.js";

export const verificarQR = async (req, res) => {

    console.log("******** VERIFICAR CONTROLLER EJECUTADO ********");

    try {

        const { qr } = req.body;

        console.log("================================");
        console.log("QR RECIBIDO DESDE FLUTTER:");
        console.log(qr);
        console.log("LONGITUD:", qr?.length);
        console.log("================================");

        if (!qr) {

            return res.status(400).json({
                message: "QR requerido"
            });
        }

        const qrLimpio = qr.trim();

        console.log("QR LIMPIO:");
        console.log(qrLimpio);

        const consulta = await pool.query(

            `
            SELECT

                c.id AS id_credencial,

                u.id,
                u.nombre,
                u.apellidop,
                u.apellidom,
                u.numeroidentificador,
                u.nombrearea,
                u.fotourl,

                c.activo,
                c.fechaemision,
                c.fechavigencia

            FROM credencial c

            INNER JOIN registro r
                ON r.id = c.id_registro

            INNER JOIN usuarios u
                ON u.id = r.id_usuarios

            WHERE c.qr = $1
            `,
            [qrLimpio]

        );

        console.log("================================");
        console.log("RESULTADO QUERY:");
        console.log(consulta.rows);
        console.log("TOTAL FILAS:", consulta.rows.length);
        console.log("================================");

        if (consulta.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Credencial no encontrada",

                qrRecibido: qrLimpio

            });
        }

        const usuario = consulta.rows[0];

        // ====================================
        // VALIDAR CREDENCIAL ACTIVA
        // ====================================

        if (!usuario.activo) {

            return res.status(403).json({

                success: false,

                message: "Credencial inactiva"

            });
        }

        const idCredencial =
            usuario.id_credencial;

        // ====================================
        // DÍA OPERATIVO (INICIA 06:00 AM)
        // ====================================

        const ahora = new Date();

        const inicioDiaOperativo =
            new Date();

        const ahora = new Date();

const inicioDiaOperativo = new Date();

// PRUEBA TEMPORAL
inicioDiaOperativo.setMinutes(
    inicioDiaOperativo.getMinutes() - 1
);

console.log("================================");
console.log("INICIO DÍA OPERATIVO:");
console.log(inicioDiaOperativo);
console.log("================================");

        // ====================================
        // BUSCAR ACCESO DEL DÍA OPERATIVO
        // ====================================

        const accesoHoy = await pool.query(

            `
            SELECT *
            FROM registroacceso
            WHERE id_credencial = $1
            AND fecha >= $2
            ORDER BY id DESC
            LIMIT 1
            `,
            [
                idCredencial,
                inicioDiaOperativo
            ]

        );

        console.log("================================");
        console.log("ACCESO DEL DÍA:");
        console.log(accesoHoy.rows);
        console.log("================================");

        let movimiento = "";

        // ====================================
        // NO EXISTE REGISTRO EN EL DÍA
        // ====================================

        if (accesoHoy.rows.length === 0) {

            movimiento = "ENTRADA";

            await pool.query(

                `
                INSERT INTO registroacceso
                (
                    fecha,
                    horaentrada,
                    horasalida,
                    tipo_acceso,
                    id_credencial
                )
                VALUES
                (
                    CURRENT_TIMESTAMP,
                    CURRENT_TIME,
                    '00:00:00',
                    'ENTRADA',
                    $1
                )
                `,
                [idCredencial]

            );

            console.log(
                "ENTRADA REGISTRADA"
            );
        }

        // ====================================
        // YA EXISTE REGISTRO
        // ====================================

        else {

            const registro =
                accesoHoy.rows[0];

            console.log("REGISTRO HOY:");
            console.log(registro);

            // ============================
            // REGISTRAR SALIDA
            // ============================

            if (

                registro.horasalida === null ||

                registro.horasalida === "00:00:00"

            ) {

                movimiento = "SALIDA";

                await pool.query(

                    `
                    UPDATE registroacceso
                    SET

                        horasalida = CURRENT_TIME,
                        tipo_acceso = 'SALIDA'

                    WHERE id = $1
                    `,
                    [registro.id]

                );

                console.log(
                    "SALIDA REGISTRADA"
                );
            }

            // ============================
            // YA TIENE ENTRADA Y SALIDA
            // ============================

            else {

                console.log(
                    "YA REGISTRÓ ENTRADA Y SALIDA HOY"
                );

                return res.status(403).json({

                    success: false,

                    message:
                        "El usuario excedió el límite de accesos permitidos para el día de hoy",

                    nombreCompleto:
                        `${usuario.nombre} ${usuario.apellidop} ${usuario.apellidom}`,

                    numeroControl:
                        usuario.numeroidentificador,

                    area:
                        usuario.nombrearea,

                    foto:
                        usuario.fotourl,

                    activo:
                        usuario.activo,

                    fechaEmision:
                        usuario.fechaemision,

                    fechaVigencia:
                        usuario.fechavigencia

                });
            }
        }

        // ====================================
        // RESPUESTA EXITOSA
        // ====================================

        res.json({

            success: true,

            nombreCompleto:
                `${usuario.nombre} ${usuario.apellidop} ${usuario.apellidom}`,

            numeroControl:
                usuario.numeroidentificador,

            area:
                usuario.nombrearea,

            foto:
                usuario.fotourl,

            activo:
                usuario.activo,

            fechaEmision:
                usuario.fechaemision,

            fechaVigencia:
                usuario.fechavigencia,

            movimiento:
                movimiento

        });

    }
    catch (error) {

        console.error("ERROR:");
        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Error interno del servidor",

            error:
                error.message
        });
    }
};