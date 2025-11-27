import express from "express";

// Import all route modules
import authRoutes from "./auth.route.js";
import menuRoutes from "./menu.route.js";
import orderRoutes from "./order.route.js";
import adminRoutes from "./admin.route.js";

const router = express.Router();

// Centralized Route registration
router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);
router.use("/order", orderRoutes);
router.use("/admin", adminRoutes);

export default router;
