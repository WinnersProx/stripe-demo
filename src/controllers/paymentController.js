import { stripe } from "../..";

const products = new Map([
  ["Basic", { price: 10000 }],
  ["Professional", { price: 30000 }],
  ["Enterprise", { price: 50000 }],
]);

export class PaymentController {
  static async createPortalSession(req, res) {
    const customer = "cus_KNUPB6gVJCeuRQ"; // The current customer  ID

    // const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer,
      return_url: process.env.STRIPE_SUCCESS_URL,
    });

    res.redirect(303, portalSession.url);
  }

  static async createCheckoutSession(req, res) {
    const product = products.get(req.body.package);

    const prices = await stripe.prices.list();

    const session = await stripe.checkout.sessions
      .create({
        payment_method_types: ["card"],
        mode: "subscription", // is either payment or subscription
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        line_items: [
          {
            // Used for collecting payments (Payment Mode)
            // price_data: {
            //   currency: "usd",
            //   product_data: { name: req.body.package },
            //   unit_amount: product.price,
            // },
            quantity: 1,
            price: prices.data[0].id,
          },
        ],
      })
      .catch((err) =>
        res.status(400).json({ success: false, error: err.message })
      );

    // TODO: could perform redirection on the backend side
    res.json({ success: true, url: session.url });
  }
}
