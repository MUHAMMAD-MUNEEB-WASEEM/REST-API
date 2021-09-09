const express = require('express')
const router = express.Router(); //to create routes

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: "Orders were fetched"
    })

})

router.post('/', (req, res, next)=>{
    res.status(201).json({
        message: "Order was created"
    })

})

//for particular order in orders
router.get('/:orderId', (req, res, next)=>{
    res.status(200).json({
            message: 'Order details',
            orderId: req.params.orderId
        })
})


router.delete('/:orderId', (req, res, next)=>{
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderIds
    })
})


module.exports = router;