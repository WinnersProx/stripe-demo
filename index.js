import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";
import path from "path";
import cors from "cors";

dotenv.config();

const PORT = 3000;

const app = express();
const router = express.Router();
const stripe = new Stripe(process.env.PRIVATE_STRIPE_KEY);

const products = new Map([
  ["Basic", { price: 10000 }],
  ["Professional", { price: 30000 }],
  ["Enterprise", { price: 50000 }],
]);

app.use(express.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, "public/views")));
app.set("views", __dirname + "/public");
app.set("view engine", "ejs");

app.use("/api", router);

router.post("/create-checkout-session", async (req, res) => {
  const product = products.get(req.body.package);

  const session = await stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      mode: "payment", // could also be subscription
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: req.body.package },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
    })
    .catch((err) => res.json({ error: err.message }));

  return res.json({ success: true, url: session.url });
});

app.get("/payment/success", (req, res) => {
  return res.render("views/success");
});

app.get("/payment/failure", (req, res) => {
  return res.render("views/failure");
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
