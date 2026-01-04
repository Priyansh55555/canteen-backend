import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import Token from "../models/Token.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
import { io } from "../server.js";

// ---------------------------------------------------------
// 1) CREATE FOOD ITEM
// ---------------------------------------------------------
export const createFoodItem = async (req, res) => {
  try {
    const { name, price, category, description, isAvailable } = req.body;

    let imageUrl = "";
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;
    }

    const food = await MenuItem.create({
      name,
      price,
      category,
      description,
      isAvailable,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      data: food,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------
// 2) UPDATE FOOD ITEM
// ---------------------------------------------------------
export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await MenuItem.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: "MenuItem not found" });
    }

    const { name, price, category, description, isAvailable } = req.body;

    // Update fields
    food.name = name || food.name;
    food.price = price || food.price;
    food.category = category || food.category;
    food.description = description || food.description;
    if (isAvailable !== undefined) food.isAvailable = isAvailable;

    // If new image uploaded, replace old one
    if (req.file) {
      // Optional: delete old image from Cloudinary if needed
      if (food.image) {
        const publicId = food.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`canteen_items/${publicId}`);
      }

      const uploaded = await uploadToCloudinary(req.file.buffer);
      food.image = uploaded.secure_url;
    }

    await food.save();

    res.json({ success: true, message: "Food item updated", data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------
// 3) DELETE FOOD ITEM
// ---------------------------------------------------------
export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await MenuItem.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Delete image from Cloudinary (if exists)
    if (food.image) {
      const publicId = food.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`canteen_items/${publicId}`);
    }

    await MenuItem.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Food item deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------
// 4) GET ALL ORDERS (Admin)
// ---------------------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.menuItemId")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------
// 5) UPDATE ORDER STATUS (Admin)
// ---------------------------------------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "preparing", "ready", "completed", "cancelled"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const tokenStatusMap = {
      pending: "waiting",
      preparing: "waiting",
      ready: "serving",
      completed: "completed",
      cancelled: "cancelled",
    };

    await Token.findOneAndUpdate(
      { orderId: order._id },
      { status: tokenStatusMap[status] }
    );

    // 🔴 SEND LIVE UPDATE TO USER
    io.to(order.userId.toString()).emit("order-status-updated", {
      orderId: order._id,
      tokenNumber: order.tokenNumber,
      status: order.status,
      updatedAt: order.updatedAt,
    });

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
