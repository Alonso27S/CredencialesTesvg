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

                message: "Credencial no encontrada",
                qrRecibido: qrLimpio

            });
        }

        const usuario = consulta.rows[0];

        const idCredencial =
            usuario.id_credencial;

        // ===========================
        // BUSCAR ÚLTIMO ACCESO
        // ===========================

        const ultimoAcceso = await pool.query(

            `
            SELECT *
            FROM registroacceso
            WHERE id_credencial = $1
            ORDER BY fecha DESC, id DESC
            LIMIT 1
            `,
            [idCredencial]

        );

        let movimiento = "ENTRADA";

        if (ultimoAcceso.rows.length > 0) {

            const ultimo =
                ultimoAcceso.rows[0];

            console.log("ÚLTIMO ACCESO:");
            console.log(ultimo);

            if (
                ultimo.horasalida === null ||
                ultimo.horasalida === "00:00:00"
            ) {

                movimiento = "SALIDA";
            }
        }

        console.log("MOVIMIENTO:");
        console.log(movimiento);

        // ===========================
        // REGISTRAR ENTRADA
        // ===========================

        if (movimiento === "ENTRADA") {

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

        // ===========================
        // REGISTRAR SALIDA
        // ===========================

        if (movimiento === "SALIDA") {

            await pool.query(

                `
                UPDATE registroacceso
                SET

                    horasalida = CURRENT_TIME,
                    tipo_acceso = 'SALIDA'

                WHERE id = $1
                `,
                [ultimoAcceso.rows[0].id]

            );

            console.log(
                "SALIDA REGISTRADA"
            );
        }

        // ===========================
        // RESPUESTA A FLUTTER
        // ===========================

        res.json({

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

            message:
                "Error interno del servidor",

            error:
                error.message
        });
    }
};