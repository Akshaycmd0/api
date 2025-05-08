const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const Student = require('../model/Student');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})



// Add new Student
router.post('/add-student', checkAuth, (req, res) => {
    const token = req.hearders.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');
    console.log(req.body)
    console.log(req.files.image)

    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
        console.log(err)
        const newStudent = new Student({
            _id: new mongoose.Types.ObjectId,
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            courseId: req.body.courseId,
            address: req.body.address,
            uId: verify.uId,
            imageUrl: result.secure_url,
            imageId: result.public_id,
        })
        newStudent.save()
            .then(result => {
                res.status(200).json({
                    newStudent: result
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            })
    })
})

// get all own students
router.get('/all-students', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');

    Student.find({ uId: verify.uId })
        .select('_id uId fillName phone address email courseId imageUrl imageId')
        .then(result => {
            res.status(200).json({
                students: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

// get own all students for a course
router.get('/all-students/:courseId', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');

    Student.find({ uId: verify.uId, courseId: req.params.courseId })
        .select('_id uId fillName phone address email courseId imageUrl imageId')
        .then(result => {
            res.status(200).json({
                students: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

// delete student

router.delete('/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');

    Student.findById(req.params.id)
        .then(student => {
            console.log(student)
            if (student.uId == verify.uId) {
                Student.findByIdAndDelete(req.params.id)
                    .then(result => {
                        cloudinary.uploader.destroy(student.imageId, (deletedImage) => {
                            res.status(200).json({
                                result: result
                            })
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            msg: err
                        })
                    })
            }
            else {
                res.status(500).json({
                    msg: 'bad request'
                })
            }
        })

    // update Student

    router.put('/:id', checkAuth, (req, res) => {
        const token = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(token, 'sbs online classes 123');
        console.log(verify.uId)

        Student.findById(req, params.id)
            .then(student => {
                if (verify.uId != student.uId) {
                    return res.status(500).json({
                        error: 'you are not eligible to update this deta'
                    })
                }
                if (req.files) {
                    cloudinary.uploader.destroy(student.imageId, (deletedImage) => {
                        cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
                            const newUpdatedStudent = {
                                fullName: req.body.fullName,
                                phone: req.body.phone,
                                email: req.body.email,
                                courseId: req.body.courseId,
                                address: req.body.address,
                                uId: verify.uId,
                                imageUrl: result.secure_url,
                                imageId: result.public_id,
                            }

                            Student.findByIdAndUpdate(req.params.id, newUpdatedStudent, { new: true })
                                .then(data => {
                                    res.status(200).json({
                                        updatedStudent: data
                                    })
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.status(500).json({
                                        error: err
                                    })
                                })

                        })
                    })
                }
                else {
                    const updatedData = {
                        fullName: req.body.fullName,
                        phone: req.body.phone,
                        email: req.body.email,
                        courseId: req.body.courseId,
                        address: req.body.address,
                        uId: verify.uId,
                        imageUrl: student.imageUrl,
                        imageId: student.imageId,
                    }
                    Student.findByIdAndUpdate(req.params.id, updatedData, { new: true })
                        .then(data => {
                            res.status(200).json({
                                updatedData: data
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            })
            .catch(err => {
                res.status(500).json({
                    erro: err
                })
            })
    })
})

// gett latest 5 students data
router.get('/latest-students',cheakAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, 'sbs online classes 123');

    Student.find({uId:verify.uId})
    .sort({$natural:-1}).limit(5)
    .then(result=>{
        res.status(500).json({
            students:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


module.exports = router;