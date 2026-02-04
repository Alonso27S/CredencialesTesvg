export const requireAdmin = (req, res, next) => {
  console.log("USER EN MIDDLEWARE:", req.user);

  if (!req.user || req.user.rol !== 1) {
    return res.status(403).json({ message: "No autorizado" });
  }

  next();
};
