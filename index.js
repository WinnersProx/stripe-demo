import dotenv from "dotenv";

import express from "express";
import path from "path";
import cors from "cors";
import Stripe from "stripe";
import { PaymentController } from "./src/controllers/paymentController";

dotenv.config();

const PORT = 3000;

const app = express();
const router = express.Router();
export const stripe = new Stripe(process.env.PRIVATE_STRIPE_KEY);

app.use(express.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, "public/views")));
app.set("views", __dirname + "/public");
app.set("view engine", "ejs");

app.use("/api", router);

router.post(
  "/create-checkout-session",
  PaymentController.createCheckoutSession
);
router.post("/create-portal-session", PaymentController.createPortalSession);


app.get("/payment/success", (req, res) => {
  return res.render("views/success");
});

app.get("/payment/failure", (req, res) => {
  return res.render("views/failure");
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
