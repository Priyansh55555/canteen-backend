import express from "express";
import { registerUser, loginUser, logoutUser , getUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/get-user", authMiddleware , getUser);


export default router;
