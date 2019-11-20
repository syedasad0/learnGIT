const express = require('express');
const app = express();
const Joi = require('joi');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const db = require('./mysqlservices');
const path = require('path');

//View Engine Setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder for CSS
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/login', function (req, res) {
    console.log("Log In");
    //res.sendFile('//home/syed/Desktop/My Projects/Contact Form With Nodemailer/login.html');
    res.render('login', {layout: false});
});
app.post('/login', function (req, res) {
    console.log(req.body);
    const schema = Joi.object().keys({
        id: Joi.string().trim().email().required(),
        password: Joi.string().min(5).max(12).required()
    });
    Joi.validate(req.body, schema, (err, x) => {
        console.log(err);
        if (err) {
            return res.send("Validation Error");
        }
        let sqlQuery = 'select * from user_cred where email = \'' + req.body.id + '\'';
        console.log(sqlQuery);
        db.query(sqlQuery, (err, rows) => {
            if (err) {
                return res.send("Some Error Occured!");
            }
            if (rows.length > 0) {
                if(rows[0].password!=req.body.password) {
                    return res.send("Password Not Matched");
                }
                //res.send(rows);
                res.render('contact', {layout: false});
            }
            else {
                res.send("Email Not Registered");
            }
        });
    });
});

app.post('/send', function (req, res) {
    //console.log(req.body);
    //res.send("Mail Sent...");
    const output = `
    <p>You Have New Contact Request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name} </li>
        <li>Company: ${req.body.company} </li>
        <li>Email: ${req.body.email} </li>
        <li>Phone: ${req.body.phone} </li>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    </ul>
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com',
        port: 465,
        secure: true,
        auth: {
            user: '*******@gmail.com', //Gmail username
            pass: '******' // Gmail password
        },
        tls:{
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: ' "Nodemailer Contact" <syedasad0@gmail.com> ',
        to: '*******@gmail.com',
        subject: 'Node Contact Request',
        text: 'Kahin Main Samay Toh Nahin?',
        html: output
    };

    transporter.sendMail(mailOptions, (err, info)=>{
        if(err) {
            return console.log(err);
        } 
        console.log("Message Sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg: 'Email has been Sent!'}, {layout: false});
        //res.render('contact', {layout: false});
    });
});


app.get('/signup', function (req, res) {
    res.render('signup', {layout: false});
});

app.post('/signup', function (req, res) {
    console.log("Received request data - ", req.body);
    //joiPackage
    const schema2 = Joi.object().keys({
        firstName: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        lastName: Joi.string().regex(/^[a-z ,.'-]+$/i).required(),
        id: Joi.string().trim().email().required(),
        password: Joi.string().min(5).max(12).required()
    });
    Joi.validate(req.body, schema2, (err, x)=>{
        console.log(err);
        if (err) {
            return res.send("Validation Error");
        }
    // (first_name, last_name, email, password)
    let sqlQuery = 'INSERT INTO user_cred  VALUES(\'' + req.body.firstName.toString() + '\' , \'' + req.body.lastName.toString() + '\', \'' + req.body.id.toString() + '\', \'' + req.body.password.toString() + '\' )';

    console.log(sqlQuery);

    db.query(sqlQuery, (err, rows) => {
        if (err) {
            //  console.log(err);
            return res.send("Some Error Occured!");
        }
        res.send('Sign Up Successfull...')
        //res.send("Rows Entered");
    });
});
});

app.listen(3000);
console.log("Server Listening at 3000");
