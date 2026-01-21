import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(400)
      .json({ success: false, message: "Unauthorised - no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res
        .status(400)
        .json({ success: false, message: "Unauthorised - Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to verify token" });
    console.log("Error in verify token middleware", error);
  }
}
