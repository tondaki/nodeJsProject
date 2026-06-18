const jwt = require("jsonwebtoken");
const User = require("../model/user");
const config = require("config");
const { token } = require("morgan");
async function IsLoggin(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        msg: "Access denied. No token provided.",
      });
    }
    const decode = jwt.verify(token, config.get("jwt_key"));
    const user = await User.findById(decode._id);
    if (!user) {
      return res.status(401).json({
        msg: "User not found.",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.send("failed is verify");
  }
}
function IsAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.stauts(403).json({
      msg: "Access denied",
    });
  }
  next();
}

// async function authMiddleware(req, res, next) {
//   try {
//     // دریافت هدر
//     const authHeader = req.header("Authorization");
//     // Host: localhost:3000
//     // GET /tasks HTTP/1.1
//     // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
//     if (!authHeader) {
//       return res.status(401).json({
//         msg: "Access denied. No token provided.",
//       });
//     }
//     // Bearer token
//     const token = authHeader.replace("Bearer ", ""); // Bearer eyJhbGciOiJIUzI1NiIs... eyJhbGciOiJIUzI1NiIs...
//     const decode = jwt.verify(token, config.get("jwt_key"));
//     const user = await User.findById(decode._id);
//     if (!user) {
//       return res.status(401).json({
//         msg: "User not found.",
//       });
//     }

//     // ذخیره کاربر در Request
//     req.user = user;

//     next();
//   } catch (err) {
//     return res.status(401).json({
//       msg: "Invalid token.",
//     });
//   }
// }

module.exports = { IsLoggin, IsAdmin };
