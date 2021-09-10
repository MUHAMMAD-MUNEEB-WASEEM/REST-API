const express = require('express')
const router = express.Router(); //to create routes
const mongoose = require('mongoose');

const Order = require('../Schema/order');
const Product = require('../Schema/product');

router.get('/', (req, res, next)=>{
    Order.find()
        .select("product quantity _id")
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                order: docs.map(doc => {
                    return {
                        _id : doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request : {
                            type: 'GET',
                            url : 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next)=>{
    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // }
    Product.findById(req.body.productId)
            .then(product=>{

                if (!product){
                    return res.status(404).json({
                        message: "Product not found"
                    })
                }

                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
            
                return order.save()
            }).then(result => {
                        const response = {
                            message: 'Order Stored!',
                            createdOrder: {
                                _id: result._id,
                                product: result.product,
                                quantity: result.quantity 
                            },
                            request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + result._id
                            }
                        }
                        res.status(201).json(response);
                    })
                    .catch(err=>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })

})

//for particular order in orders
router.get('/:orderId', (req, res, next)=>{
    Order.findById(req.params.orderId)
         .select('-__v')//-ve sign to remove this __v field
         .exec()
         .then(order =>{
            if (!order){
                res.status(404).json({
                    message: "Order not found"
                })
            }
             res.status(200).json({
                 order: order,
                 request: {
                     type: 'GET',
                     url: 'http://localhost:3000/orders'
                 }
             })
         })
         .catch(err => {
             res.status(500).json({
                 error:err
             })
         })
})


router.delete('/:orderId', (req, res, next)=>{
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(order => {
            res.status(200).json({
                message: "Order Deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId : 'ID', quantity: "Number"},
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error:err
         });
    })
});

module.exports = router;