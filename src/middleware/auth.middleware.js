import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token; // <- token from cookie
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("amdin user", decoded)

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin resources." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};





