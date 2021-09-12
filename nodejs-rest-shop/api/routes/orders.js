const express = require('express')
const router = express.Router(); //to create routes

const checkAuth  = require('../auth/check-auth')

//controllers
const OrdersController = require('../controllers/orders');


//routes
router.get('/', checkAuth, OrdersController.orders_get_all)

router.post('/', checkAuth, OrdersController.order_create_order)

//for particular order in orders
router.get('/:orderId', checkAuth, OrdersController.order_get_order)


router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;