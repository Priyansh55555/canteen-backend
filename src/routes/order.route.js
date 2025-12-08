import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getActiveTokens,
} from "../controllers/order.controller.js";

const router = express.Router();

// Student
router.post("/", authMiddleware, placeOrder);
router.get("/user", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderById);

// Admin
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/status/:id", authMiddleware, adminMiddleware, updateOrderStatus);
router.get("/admin/active-tokens", authMiddleware, adminMiddleware, getActiveTokens);

export default router;
