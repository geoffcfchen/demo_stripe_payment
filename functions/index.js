const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const Stripe = require("stripe");

const PUBLISHABLE_KEY = "your_publishable_key";
const SECRET_KEY = "your_secret_key";

const stripe = new Stripe(SECRET_KEY, {
  apiVersion: "2022-08-01",
  typescript: true,
});

exports.paymentSheet = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

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
