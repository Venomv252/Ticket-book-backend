import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Event from "../models/Events.js";
import Users from "../models/Users.js";
import Show from "../models/Show.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { eventId, userId, showId, category, seats } = req.body;

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const ticket = show.ticketPricing.find((t) => t.category === category);
    if (!ticket) return res.status(404).json({ message: "Error in ticket pricing" });

    const amount = ticket.price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: { showId, userId, seats: JSON.stringify(seats) },
    });

    res.json({ clientSecret: paymentIntent.client_secret, amount });
  } catch (error) {
    console.error("Payment Intent error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};

// Stripe Webhook
export const paymentWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { showId, userId, seats } = paymentIntent.metadata;

    try {
      await Payment.create({
        user: userId,
        show: showId,
        amount: paymentIntent.amount / 100,
        seats: JSON.parse(seats),
        paymentId: paymentIntent.id,
        status: "succeeded",
      });
      console.log("Payment succeeded and saved to DB!");
    } catch (dbError) {
      console.error("Error saving payment to DB:", dbError.message);
    }
  }

  res.json({ received: true });
};
