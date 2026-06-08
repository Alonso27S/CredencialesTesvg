import { pool } from "../db.js";

export const verificarQR = async (req, res) => {

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
                usuario.fechavigencia

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