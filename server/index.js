import express from "express";
import Stripe from "stripe";

const app = express();
const port = 3000;

const PUBLISHABLE_KEY =
  "pk_test_51Lhf4GDsOD7fAAq8BAQLfXxnP69pNkOgwcX8CbYx5YEsqzQWHEVFbKoAIjetsXCyQzq46U73S4fEQBOeJLo6inea00vzpGOQet";
const SECRET_KEY =
  "sk_test_51Lhf4GDsOD7fAAq83nxSFjarrAwHnVoQFvmgGu3xcTEY4PPFye5gbA5JJWzO63EUqe9hRJo4TrKq0oYk18N0tPSy0040UXN5du";
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/create-payment-intent", async (req, res) => {
  const stripe = Stripe(SECRET_KEY, { apiVersion: "2022-08-01" });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, //lowest denomination of particular currency
      currency: "use",
      payment_method_types: ["card"],
    });
    const clientSecret = paymentIntent.client_Secret;
    res.json({
      clientSecret: clientSecret,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
});
