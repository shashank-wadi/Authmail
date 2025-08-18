import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token.trim();
  }
  
  if (!token && req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.substring(7).trim(); 
    }
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login again."
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again."
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again."
    });
  }
};

export default userAuth;
