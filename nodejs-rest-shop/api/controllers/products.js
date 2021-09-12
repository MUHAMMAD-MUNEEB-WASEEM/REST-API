const mongoose = require('mongoose')


const Product = require('../Schema/product')



exports.products_get_all = (req, res, next)=>{
    Product.find()
            // .select('name price productImage _id') // to get only these fields
           .exec()
           .then(docs =>{
               const response = {
                   count: docs.length,
                   products: docs.map(doc=>{
                       return {
                           name : doc.name,
                           price : doc.price,
                           productImage: doc.productImage,
                           _id : doc._id,
                           request: {
                               type: 'GET', 
                               url : 'http://localhost:3000/products/' + doc._id
                           }
                       }
                   })
               }
            //    if (docs.length >= 0){
                res.status(200).json(response);
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

}

exports.products_create_product = (req, res, next)=>{
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }

    console.log(req.file)//available for upload.single
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
           .then(result=>{
                console.log(result);
                res.status(201).json({
                    message: "Created product successfully",
                    createdProduct: {
                        name: result.name,
                        price: result.price,
                        _id: result._id, 
                        productImage: result.productImage,
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            })
            .catch(err=> {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            });

}

exports.products_get_product = (req, res, next)=>{
    const id = req.params.productId;

    Product.findById(id)
           .select( 'name price _id productImage')
           .exec() 
           .then(doc=>{
               console.log("From dataabase" + doc)

               if(doc){
                const response = {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
                res.status(200).json(response)
               } else{
                   res.status(404).json({message: 'No valid entry found for ID'})
               }
           })
           .catch(err=>{
               console.log(err);
               res.status(500).json({error: err})
            })
}

exports.products_update_product = (req, res, next)=>{
    const id = req.params.productId;
    
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value; //{name: req.body.newName, price: req.body.newPrice}
    }
    
    Product.updateOne({_id:id}, { $set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Product Updated",
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + id
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
}

exports.products_delete_product = (req, res, next)=>{
    const id = req.params.productId
    Product.remove({_id: id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Product deleted',
                    request:{
                        type: 'POST',
                        url: 'http://localhost:3000/products',
                        body: { name: "String", price: 'Number'}
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
}