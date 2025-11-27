import express from "express";
import { 
  getAllMenuItems,
  getMenuItemById,
  searchMenu,
} from "../controllers/menu.controller.js";

const router = express.Router();

// GET all food items
router.get("/", getAllMenuItems);

// GET single food item
router.get("/:id", getMenuItemById);

// Search menu by name/category
router.get("/search/:keyword", searchMenu);

export default router;
