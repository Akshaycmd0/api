const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const fee = require('../model/Fee');


router.post('/add-fee', checkAuth, (req, res) => {
    const token = req.hearders.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');

    const newFee = new fee({
        _id: new mongoose.Types.ObjectId,
        fullName: req.body.fullName,
        phone: req.body.phone,
        courseId: req.body.courseId,
        uId: verify.uId,
        amount: req.body.amount,
        remark: req.body.remark,
    })
    newFee.save()
    .then(result=>{
        res.status(200).json({
            newFee:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

// get all fee collection data for any user
router.get('/payment-hostory',checkAuth,(req,res)=>{
    const token = req.hearders.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');

    Fee.find({uId:verify.uId})
    .then(result=>{
        res.status(200).json({
            paymenthistory:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})

// get all payments for any syudents in a course
router.get('/all-payment',checkAuth,(req,res)=>{
    const token = req.hearders.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');
    
    Fee.find({uId:verify.uId,courseId:req.query.courseId,phone:req.query.phone})
    .then(result=>{
        res.status(500).json({
            fees:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})



module.exports = router;