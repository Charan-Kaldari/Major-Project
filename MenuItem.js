const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, note } = req.body;
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      note,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("items.menuItem", "name image");
  res.json(orders);
};

exports.allOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email").populate("items.menuItem", "name");
  res.json(orders);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
};
