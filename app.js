const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors')

const userRoute = require('./routes/user');
const courseRoute = require('./routes/course');
const studentRoute = require('./routes/student');
const feeRoute = require('./routes/fee');
const fileUpload = require('express-fileupload');

mongoose.connect('mongodb+srv://akshay:1234@cluster0.b2xxgcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('connected with database')
    })
    .catch(err => {
        console.log(err)
    })

app.use(bodyParser.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir : '/tmp/'
}));

app.use('/api/user', userRoute);
app.use('/api/course', courseRoute);
app.use('/api/student', studentRoute);
app.use('/api/fee', feeRoute);

app.use('*', (req, res) => {
    res.status(404).json({
        msg: 'bad request'
    });
});

module.exports = app;