const  router = require('express').Router();

const userRouter = require('./User');
const checkoutRouter = require('./Checkout');
const productRouter = require('./Product');

router.get('/',(req,res)=>{
    res.json({msg:"message from router home"});
});

router.use("/user",userRouter);
router.use("/checkout",checkoutRouter);
router.use("/product",productRouter);

module.exports = router;