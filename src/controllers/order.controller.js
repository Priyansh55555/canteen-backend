import Order from "../models/Order.js";
import Token from "../models/Token.js";
import MenuItem from "../models/MenuItem.js";


// ---------------------------------------------------------
// 1) PLACE ORDER  (Student)
// ---------------------------------------------------------
export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must include at least one item",
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    let filteredItems = [];
    for (let item of items) {
      const menuItem = await MenuItem.findById(item._id);
      filteredItems.push({ quantity : item.quantity, menuItemId: item._id });
      if (!menuItem) continue;
      totalAmount += menuItem.price * item.quantity;
    }

    // Generate token
    const lastToken = await Token.findOne().sort({ tokenNumber: -1 });
    const newToken = lastToken ? lastToken.tokenNumber + 1 : 1;

    // Create order
    const order = await Order.create({
      userId: req.user.userId,
      items : filteredItems,
      totalAmount,
      tokenNumber: newToken,
      status: "pending",
    });

    // Create token entry
    await Token.create({
      tokenNumber: newToken,
      orderId: order._id,
      status: "waiting",
    });

    return res.json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
      tokenNumber: newToken,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// ---------------------------------------------------------
// 2) GET USER ORDER HISTORY
// ---------------------------------------------------------
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId })
      .populate("items.menuItemId")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// ---------------------------------------------------------
// 3) GET SINGLE ORDER DETAILS
// ---------------------------------------------------------
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("items.menuItemId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({ success: true, order });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// ---------------------------------------------------------
// 4) ADMIN: GET ALL ORDERS
// ---------------------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.menuItemId")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// ---------------------------------------------------------
// 5) ADMIN: UPDATE ORDER STATUS (pending → processing → ready → completed)
// ---------------------------------------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "processing", "ready", "completed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Update order
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

    // Update token status also
    const tokenStatusMap = {
      pending: "waiting",
      processing: "waiting",
      ready: "serving",
      completed: "completed",
    };

    await Token.findOneAndUpdate(
      { orderId: order._id },
      { status: tokenStatusMap[status] }
    );

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// ---------------------------------------------------------
// 6) ADMIN: ACTIVE TOKENS (TV SCREEN)
// ---------------------------------------------------------
export const getActiveTokens = async (req, res) => {
  try {
    const tokens = await Token.find({
      status: { $in: ["waiting", "serving"] }
    }).sort({ tokenNumber: 1 });

    return res.json({ success: true, tokens });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
