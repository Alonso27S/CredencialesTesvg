import { pool } from "../db.js";

export const verificarQR = async (req, res) => {

    try {

        const { qr } = req.body;

        // VALIDAR QR
        if (!qr) {

            return res.status(400).json({

                message: "QR requerido"

            });
        }

        // CONSULTA
        const consulta = await pool.query(

            `
            SELECT

                r.nombre,
                r.apellidop,
                r.apellidom,
                r.numeroidentificador,

                c.fecha_emision,
                c.fecha_vigencia,
                c.qr_encriptado,
                c.has_verificacion,
                c.activo

            FROM credencial c

            INNER JOIN registro r
            ON r.id = c.id_registro

            WHERE c.qr_encriptado = $1
            `,
            [qr]

        );

        // SI NO EXISTE
        if (consulta.rows.length === 0) {

            return res.status(404).json({

                message: "Credencial no encontrada"

            });
        }

        // DATOS
        const usuario = consulta.rows[0];

        // RESPUESTA
        res.json({

            nombre:
                usuario.nombre,

            apellidoPaterno:
                usuario.apellidop,

            apellidoMaterno:
                usuario.apellidom,

            numeroControl:
                usuario.numeroidentificador,

            fecha_emision:
                usuario.fecha_emision,

            fecha_vigencia:
                usuario.fecha_vigencia,

            activo:
                usuario.activo,

            verificado:
                usuario.has_verificacion

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Error interno del servidor"

        });
    }
};