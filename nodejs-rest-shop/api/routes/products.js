const express = require('express')
const router = express.Router(); //to create routes
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../auth/check-auth')

//importing controller
const ProductController = require('../controllers/products');


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

router.get('/', ProductController.products_get_all)

//updating with upload.single for image or file
router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product)

//for particular product in products
router.get('/:productId', ProductController.products_get_product)

router.patch('/:productId', checkAuth, ProductController.products_update_product)

router.delete('/:productId', checkAuth, ProductController.products_delete_product)

module.exports = router;