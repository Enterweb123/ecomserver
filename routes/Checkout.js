const router  = require("express").Router();
const {v4 : uuid} = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_KEY);

// 1) get model
const {CheckoutModel} = require('../models');

// 2) Verify User For make payment
const getUser = require("../middlewares/getUser");


router.get("/",(req,res)=>{
    res.json({"msg":"from checkout router"});
});

router.post("/create-payment-intent", getUser, async(req,res)=>{
    const {total,items} = req.body;

    const orderId = uuid();

    // console.log("total", total);
    //1) create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount   : total*100,
        currency : "inr",
        metadata : {
            order_id:orderId,
        },
    });

    //2) save checkout data to db
    await CheckoutModel.create({
        items,
        total,
        order_id:orderId,
        payment_id:paymentIntent.id,
        user:req.userId,
    });

    // router responce
    res.json({ clientSecret:paymentIntent.client_secret });
});

// provide order details
router.get("/orders",getUser,async(req,res)=>{
    const orders = await CheckoutModel.find({ user:req.userId }).populate("user","-password");
    res.json(orders);
})

module.exports = router;