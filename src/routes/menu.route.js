import express from "express";
import { 
  getAllMenuItems,
  getAllMenuLandingPage,
  getMenuItemById,
  searchMenu,
} from "../controllers/menu.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router();

// GET all food items
router.get("/", authMiddleware, getAllMenuItems);

// GET all food items for landing page
router.get("/landing", getAllMenuLandingPage);

// GET single food item
router.get("/:id", getMenuItemById);

// Search menu by name/category
router.get("/search/:keyword", searchMenu);

export default router;
