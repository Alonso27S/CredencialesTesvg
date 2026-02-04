// controllers/registro.auto.controller.js
export const crearRegistro = async (client, idUsuario) => {
  const result = await client.query(
    `INSERT INTO registro (id_usuarios)
     VALUES ($1)
     RETURNING id`,
    [idUsuario]
  );

  return result.rows[0].id;
};
