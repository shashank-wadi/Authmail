import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  // Debug: log incoming cookies and auth header
  console.log("Cookies received:", req.cookies);
  console.log("Authorization header:", req.headers.authorization);

  let token = null;

  // 1️⃣ Check cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token.trim();
  }

  // 2️⃣ If no token in cookies, check Authorization header
  if (!token && req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.substring(7).trim(); // Remove "Bearer "
    }
  }

  // 3️⃣ If still no token, reject
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please login again."
    });
  }

  try {
    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.userId = decoded.id;

    // Continue to next middleware
    next();
  } catch (error) {
    console.error("Token verification error:", error);

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
