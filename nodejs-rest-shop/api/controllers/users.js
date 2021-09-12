const User = require('../Schema/user')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup =  (req, res, next) => {
        
    // password: req.body.password //not good, as easily accessible, we have to encrypt or hash password it using package bycrypt
    //below 10 is salt value, which add 10 random strings to avoid password hacking
    
    //first we check if email already exists or not, if not (else), then create user
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1){
                return res.status(409).json({
                    message: "E-mail already exists"
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if (err){
                        return res.status(500).json({
                            error: err
                        })
                    }  else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
            
                        user
                        .save()
                        .then(result => {
                            console.log(result)
                            res.status(201).json({
                                message: "User created"
                            })
                        })
                        .catch(err=>{
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
                        })
                    }
                });
            }
        })

}

exports.user_login =  (req, res, next)=>{
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length <1 ){
                return res.status(401).json({
                    messsage: "Auth failed"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                   if (err){
                       return res.status(401).json({
                            message: 'Auth failed'
                       })
                   };
                   if (result){
                    
                    //token to login
                    
                       const token = jwt.sign({
                           email: user[0].email,
                           userId: user[0]._id
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                       return res.status(200).json({
                           message: 'Auth successful',
                           token: token
                       })
                   }
                   res.status(401).json({
                        message: 'Auth failed'
                   })
               }) 
            }
        )
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.delete_user = (req, res, next)=>{
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted"
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}