const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },//order of particular product, try to create relation between order and product
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);