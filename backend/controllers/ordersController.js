import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import paystack from "@paystack/paystack-sdk"
import crypto from 'crypto'


// Place Order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid order details"});
    }
    // calculate amount using items;
    let amount = await items.reduce(async (acc, item) => {
        const product = await Product.findById(item.product);
        return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge 2%
    amount += Math.floor((amount * 2) / 100);
    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",

    });
    
    // Clear user's cart after successful order
    await User.findByIdAndUpdate(userId, { cartItems: {} });
    
    res.json({ success: true, message: "Order placed successfully", });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Place Order Paystack: /api/order/paystack
export const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const {origin} = req.headers;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid order details"});
    }

    let productData = [];

    // calculate amount using items;
    let amount = await items.reduce(async (acc, item) => {
        const product = await Product.findById(item.product);
        productData.push({
          name: product.name,
          price: product.offerPrice,
          quantity: item.quantity,
        });
        return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax charge 2%
    amount += Math.floor((amount * 2) / 100);

    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "Online",

    });

    // Clear user's cart after order is created (before redirecting to payment)
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    // Paystack Gateway Initialize
    const paystackInstance = new paystack(process.env.Paystack_SECRET_KEY);

    // Get user email for transaction
    const user = await User.findById(userId);
    const customerEmail = user?.email || req.body.email || 'user@example.com';

    // Create Paystack transaction
    // callback_url is for user redirect after payment (frontend URL)
    // Webhook should be configured separately in Paystack dashboard
    const callbackUrl = `${origin}/payment-success`;
    const transaction = await paystackInstance.transaction.initialize({
      amount: amount * 100, // Paystack expects amount in smallest currency unit (e.g., kobo/cents)
      email: customerEmail,
      callback_url: callbackUrl, // This is where users are redirected after payment
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.json({ success: true, url: transaction.data.authorization_url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Paystack Webhook to Verify Payments Action : /paystack
export const paystackWebhook = async (request, response) => {
  const webhookSecret = process.env.Paystack_WEBHOOK_SECRET;

  const sigHeader = request.headers['x-paystack-signature'] || request.headers['paystack-signature'];

  // `request.body` will be a Buffer when using `express.raw` for this route
  const rawBody = request.body;
  if (!rawBody || !sigHeader || !webhookSecret) {
    return response.status(400).send('Missing signature, payload, or webhook secret');
  }

  const expectedSignature = crypto.createHmac('sha512', webhookSecret).update(rawBody).digest('hex');
  if (expectedSignature !== sigHeader) {
    return response.status(400).send('Invalid signature');
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch (error) {
    return response.status(400).send('Invalid payload');
  }

  try {
    // Handle successful charge events
    if (event.event === 'charge.success') {
      const reference = event.data?.reference;
      const metadata = event.data?.metadata || {};
      const orderId = metadata.orderId || metadata.order_id;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.status = 'Paid';
          order.paymentInfo = {
            provider: 'paystack',
            reference,
            paidAt: new Date(),
            raw: event.data,
          };
          await order.save();

          // Mark ordered products as out of stock (app uses boolean `inStock`)
          if (Array.isArray(order.items)) {
            await Promise.all(order.items.map(async (it) => {
              try {
                await Product.findByIdAndUpdate(it.product, { inStock: false });
                console.log(`Marked product ${it.product} as out of stock`);
              } catch (e) {
                console.error('Failed to update product stock', e.message);
              }
            }));
          }

          // Clear user's cart after successful payment (backup in case it wasn't cleared earlier)
          if (order.userId) {
            await User.findByIdAndUpdate(order.userId, { cartItems: {} });
          }

          // Placeholder: notify seller(s)
          console.log(`Order ${orderId} marked paid — notify sellers.`);
        }
      }
    }

    // Respond quickly to Paystack
    return response.status(200).send('OK');
  } catch (err) {
    console.error('Webhook handling error', err.message);
    return response.status(500).send('Server error');
  }
}

// webhook handler end

// Get Orders by User ID :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    // Show all orders for the user, regardless of payment status
    const orders = await Order.find({
      userId,
    }).populate("items.product address").sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    }).populate("items.product address").sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

