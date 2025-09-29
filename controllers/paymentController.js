import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Event from "../models/Events.js";
import Users from "../models/Users.js";
import Show from "../models/Show.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymnetIntent = async (req, res) => {
  try {
    const { eventId, userId, showId, category, seats } = req.body;

    //Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    //Find the show
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    //get ticket price for selected category

    const ticket = Show.ticketPricing.find((t) => category === category);
    if (!ticket) {
      return res.status(404).json({ message: "Error in ticket pricing" });
    }

    //calculate the ticket price

    const amount = ticket.price * 100;

    //creating a payment intent

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: { showId, userId, seats: JSON.stringify(seats) },
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (error) {
    console.error("payment Intent error: ",error);
    res.status(500).json({ message: "Payment failed" });
  }
};

// Stripe webhook
export const Paymentwebhook = async(req,res) => {

    let event;
    try{
        const sig = req.headers["stripe-signature"];
      
        event = stripe.webhooks.constructEvent(
        req.body, // raw body
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
    );
    }catch(error){
        console.error("webhook error", error.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle successful payment
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { showId, userId, seats } = paymentIntent.metadata;

    await Payment.create({
      user: userId,
      show: showId,
      amount: paymentIntent.amount / 100,
      seats: JSON.parse(seats),
      paymentId: paymentIntent.id,
      status: "succeeded",
    });

    console.log("Payment succeeded and saved to DB!");
  }

  res.json({ received: true });


};
