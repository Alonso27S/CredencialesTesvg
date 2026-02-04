export const verificarBloqueo = (user) => {
  if (user.bloqueado_hasta) {
    const ahora = new Date();
    const bloqueo = new Date(user.bloqueado_hasta);

    if (bloqueo > ahora) {
      return {
        bloqueado: true,
        mensaje: "Usuario bloqueado temporalmente. Intenta más tarde.",
      };
    }
  }

  return { bloqueado: false };
};
