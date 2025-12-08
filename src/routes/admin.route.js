import express from "express";
import upload from "../middleware/upload.middleware.js";
import  { authAdmin }  from "../middleware/auth.middleware.js";

import {
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin: CREATE food item
router.post(
  "/food/create",
  authAdmin,
  upload.single("image"),
  createFoodItem
);

// Admin: UPDATE food item
router.put(
  "/food/:id",
  authAdmin,
  upload.single("image"),
  updateFoodItem
);

// Admin: DELETE food item
router.delete("/food/:id", authAdmin, deleteFoodItem);

// Admin: View all orders
router.get("/orders", authAdmin, getAllOrders);

// Admin: Update order status (Preparing, Ready, Completed)
router.put("/order/:id/status", authAdmin, updateOrderStatus);

export default router;
