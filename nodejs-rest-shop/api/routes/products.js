const express = require('express')
const router = express.Router(); //to create routes
const mongoose = require('mongoose')
const multer = require('multer')

//Below work is to enhance image experience with good filename and readable, limits, filters

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
  });

const fileFilter = (req, file, cb) => {

    //reject or accept file on some conditions

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        
    //accepting or storing file

    cb(null, true);
    
    }else {

    //rejecting
    cb(null,false);
    }
}

//main code combining all above to upload image
const upload = multer({

    storage: storage,
    limits: {
    fileSize: 1024 * 2024 * 5 //bytes, 5 MB
    },
    fileFilter: fileFilter
    
});//folder where multer uploads all files

//This upload will be used to upload images in post route with upload.single

//starting of routes

const Product = require('../Schema/product');


router.get('/', (req, res, next)=>{
    Product.find()
            .select('name price _id') // to get only these fields
           .exec()
           .then(docs =>{
               const response = {
                   count: docs.length,
                   products: docs.map(doc=>{
                       return {
                           name : doc.name,
                           price : doc.price,
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

})
//updating with upload.single for image or file
router.post('/', upload.single('productImage'), (req, res, next)=>{
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // }

    console.log(req.file)//available for upload.single
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
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


})

//for particular product in products
router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;

    Product.findById(id)
           .select( 'name price _id')
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
})

router.delete('/:productId', (req, res, next)=>{
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
})


module.exports = router;