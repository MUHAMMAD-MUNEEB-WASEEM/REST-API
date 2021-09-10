const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    product: { type:mongoose.Schema.Types.ObjectId, ref: 'Product' },//connecting this schema of order with product, as we know order is of product
    quantity: { type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);