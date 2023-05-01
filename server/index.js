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

// app.post("/create-payment-intent", async (req, res) => {
//   const stripe = Stripe(SECRET_KEY, { apiVersion: "2022-11-15" });

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 1099, //lowest denomination of particular currency
//       currency: "usd",
//       payment_method_types: ["card"],
//     });
//     const clientSecret = paymentIntent.client_secret;
//     res.json({
//       clientSecret: clientSecret,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ error: error.message });
//   }
// });

app.post("/payment-sheet", async (req, res) => {
  const stripe = new Stripe(SECRET_KEY, {
    apiVersion: "2022-08-01",
    typescript: true,
  });

  // const customer = await stripe.customers.create({ email });
  const customers = await stripe.customers.list();
  console.log("customers", customers);
  const customer = customers.data[0];

  if (!customer) {
    return res.send({
      error: "You have no customer created",
    });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-08-01" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5099,
    currency: "usd",
    payment_method_types: ["card", "link", "us_bank_account"],
  });

  return res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});
