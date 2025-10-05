import express from "express";
import { createPaymentIntent, paymentWebhook } from "../controllers/paymentController.js";

const router = express.Router();

// JSON body for creating PaymentIntent
router.post("/create-payment-intent", express.json(), createPaymentIntent);

// Raw body for Stripe webhook
router.post("/webhook", express.raw({ type: "application/json" }), paymentWebhook);

export default router;
