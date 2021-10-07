import dotenv from "dotenv";
import express from "express";
import stripe from "stripe";
import path from "path";

dotenv.config();

const PORT = 3000;

const app = express();
app.use("/", express.static(path.join(__dirname, "public/views")));

const router = express.Router();

const stripeSDK = stripe(process.env.PRIVATE_STRIPE_KEY);

const products = new Map([
  [1, { priceInCents: 20000, name: "My Great E-Book" }],
]);

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
