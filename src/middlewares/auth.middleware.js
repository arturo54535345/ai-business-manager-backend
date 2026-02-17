const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    let token;

    //busco el token en el header de la peticion
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "No estas autorizado..." });
    }
    //verifico el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //busco al dueño de ese token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "No estas autorizado..." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error en la autenticacion:", error);
    res
      .status(401)
      .json({ message: "No estas autorizado contraseña incorrecta..." });
  }
};

module.exports = auth;
