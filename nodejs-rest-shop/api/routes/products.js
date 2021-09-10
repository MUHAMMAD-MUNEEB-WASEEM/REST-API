const express = require('express')
const router = express.Router(); //to create routes
const mongoose = require('mongoose')

const Product = require('../Schema/product');


router.get('/', (req, res, next)=>{
    Product.find()
           .exec()
           .then(docs =>{
               console.log(docs);
            //    if (docs.length >= 0){
                res.status(200).json(docs);
        //        }else{
        //            res.status(404).json({
        //                message: "No entries found"
        //            })
        //        }
           })
           .catch(err =>{
               console.log(err);
               res.status(500).json({
                   error:err
               })
           })

})

router.post('/', (req, res, next)=>{
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
           .then(result=>{
                console.log(result);
                res.status(201).json({
                    message: "Handling POST requests to /products",
                    createdProduct: result
                })
            })
            .catch(err=> {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            });


})

//for particular product in products
router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;

    Product.findById(id)
           .exec() 
           .then(doc=>{
               console.log("From dataabase" + doc)

               if(doc){
                res.status(200).json(doc)
               } else{
                   res.status(404).json({message: 'No valid entry found for ID'})
               }
           })
           .catch(err=>{
               console.log(err);
               res.status(500).json({error: err})
            })
})

router.patch('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value; //{name: req.body.newName, price: req.body.newPrice}
    }
    
    Product.updateOne({_id:id}, { $set: updateOps})
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json(result)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
    res.status(200).json({
        message: 'Updated product!'
    })
})

router.delete('/:productId', (req, res, next)=>{
    const id = req.params.productId
    Product.remove({_id: id})
            .exec()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
})


module.exports = router;