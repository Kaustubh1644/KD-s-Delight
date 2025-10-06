import Order from "./../modals/orderModal.js";
// import Stripe from "stripe";
import "dotenv/config";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// create order function
export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      zipCode,
      paymentMethod,
      subtotal,
      tax,
      total,
      items,
    } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid or empty items array" });
    }

    const orderItems = items.map(
      ({ item, name, price, imageUrl, quantity }) => {
        const base = item || {};
        return {
          item: {
            name: base.name || name || "Unknown",
            price: Number(base.price ?? price) || 0,
            imageUrl: base.imageUrl || imageUrl || "",
          },
          quantity: Number(quantity) || 0,
        };
      }
    );

    // Default Shipping Cost
    const shippingCost = 0;
    let newOrder;
    if (paymentMethod === "online") {
  // Stripe is disabled, mark payment as "pending"
  newOrder = new Order({
    user: req.user._id,
    firstName,
    lastName,
    phone,
    email,
    address,
    city,
    zipCode,
    paymentMethod,
    subtotal,
    tax,
    total,
    shipping: 0,
    items: orderItems,
    paymentStatus: "pending",  // mark as pending for testing
  });

  await newOrder.save();
  return res.status(201).json({ order: newOrder, checkoutUrl: null });
}


    //  if payment is done cod
    newOrder = new Order({
      user: req.user._id,
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      zipCode,
      paymentMethod,
      subtotal,
      tax,
      total,
      shipping: shippingCost,
      items: orderItems,
      paymentStatus: "succeeded",
    });
    await newOrder.save();
    return res.status(201).json({ order: newOrder, checkoutUrl: null });
  } catch (error) {
    console.error("CreateOrder Error:", error);
    res.status(500).json({ message: "server Error", error: error.message });
  }
};

// confrom payment
// confirm payment (Stripe disabled)
export const confirmPayment = async (req, res) => {
  return res
    .status(400)
    .json({ message: "Stripe payment is disabled in this version" });
};


//  Get order
export const getOrders = async (req, res) => {
  try {
    const filter = { user: req.user._id }; // order belong to that particular user
    const rawOrders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    //  format
    const formatted = rawOrders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
      createdAt: o.createdAt,
      paymentStatus: o.paymentStatus,
    }));
    res.json(formatted);
  } catch (error) {
    console.error("getOrders Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Admin Route get all orders
export const getAllOrders = async (req, res) => {
  try {
    const raw = await Order.find({}).sort({ createdAt: -1 }).lean();

    const formatted = raw.map((o) => ({
      _id: o._id,
      user: o.user,
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      phone: o.phone,
      address: o.address ?? o.shippingAddress?.address ?? "",
      city: o.city ?? o.shippingAddress?.city ?? "",
      zipCode: o.zipCode ?? o.shippingAddress?.zipCode ?? "",

      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      // paymentMethod: o.paymentStatus,
      status: o.status,
      createdAt: o.createdAt,

      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("getAllOrders Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// update order without token for admin
export const updateAnyOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(400).json({ message: "Order not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("updateAnyOrder Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get order by id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (req.query.email && order.email !== req.query.email) {
      return res.status(403).json({ message: "Access Denide" });
    }
    res.json(order);
  } catch (error) {
    console.error("getOrderById Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// update by id
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (req.body.email && order.email !== req.body.email) {
      return res.status(403).json({ message: "Access Denide" });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    console.error("getOrderById Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
