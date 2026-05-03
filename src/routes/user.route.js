import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.put("/", authMiddleware,  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "posterPicture", maxCount: 1 },
  ]) ,updateUser);

export default router;
