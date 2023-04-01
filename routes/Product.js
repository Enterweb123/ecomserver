const router = require("express").Router();
const {v4 : uuid} = require("uuid");

// product model
const {ProductModel} = require("../models");

router.get('/',(req,res)=>{
    res.json({msg:"message from router home"});
});

router.post('/addproduct',async(req,res)=>{
    const {name,image,cost,category,details,rating } = req.body;
    const orderId = uuid();

    const responce = await ProductModel.create({
        product_id:orderId,
        product_name:name,
        product_rating:rating,
        product_image:image,
        product_cost:cost,
        product_category:category,
        product_details:details
    })
    res.json({msg:responce})
});


router.get('/allproduct',async(req,res)=>{
try {
    const responce = await ProductModel.find().select("-__v -createdAt -updatedAt");
    res.send(responce)
} catch (error) {
    res.json({"msg":error.message});
  }
}
);

router.delete('/deleteproduct/:ids',async(req,res)=>{
    const {ids} = req.params;
    // console.log(id);
    // res.json({msg:ids})
    // res.json({msg:"id"})
    try {
        const responce = await ProductModel.findByIdAndDelete(ids);
        res.json({msg:responce})
    } catch (error) {
        res.json({"msg":error.message});
    }
    }
);

// get single products
router.get('/getsingleproduct/:ids',async(req,res)=>{
    const {ids} = req.params;
    // console.log(id);
    try {
        const responce = await ProductModel.findById(ids).select("-__v");
        res.json(responce)
    } catch (error) {
        res.json({"msg":error.message});
    }
    }
);

// update single products
router.put('/updateproduct',async(req,res)=>{
    try {
        const responce = await ProductModel.findByIdAndUpdate(
            req.body.product_id,
            {
               product_name    : req.body.product_name,
               product_image   : req.body.product_image,
               product_cost    : req.body.product_cost,
               product_category: req.body.product_category,
               product_details : req.body.product_details,
               product_rating  : req.body.product_rating,
            },
            {new:true}
        );
        res.json(responce)
    } 
    catch (error) {
        res.json({"msg":error.message});
    }
    }
);

module.exports = router;