const jwt = require("../lib/jsonwebtoken");

const { SECRET } = require("../config");

exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies["auth"];

  if (!token) {
    return next();
  }

  try {
    const decodedToken = await jwt.verify(token, SECRET); // проверява дали SECRET е направен оригинално от нас

    req.user = decodedToken;
    res.locals.isAuthenticated = true; // за handlebars
    // res.locals.user = decodedToken; // това е ако ни трябва имейла да го изкараме на лентата

    next();
  } catch (err) {
    res.clearCookie("auth");
    res.redirect("/auth/login");
  }
};

exports.isAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login"); // ако има user на next(), продължи напред
  }

  next();
};
