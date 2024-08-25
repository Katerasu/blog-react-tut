const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'conmeo123';

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser())

mongoose.connect('mongodb://localhost:27017/react-tut-blog')
    .then((result) => console.log('Connected to mongodb'))
    .catch((err) => console.log(err));

app.post('/register', async (req, res) => {
    // console.log(req.body);
    const {username, password} = req.body;
    try {
        const userDoc = await UserModel.create({ username, password: bcrypt.hashSync(password, salt) });
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    // console.log(req.body);
    const {username, password} = req.body;
    try {
        const userDoc = await UserModel.findOne({ username });
        // res.json(userDoc);
        const loginOK = bcrypt.compareSync(password, userDoc.password);
        if (loginOK) {
            //logged in
            jwt.sign({ username, id: userDoc.id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json('ok');
            });
        } else {
            //not log in
            res.status(400).json('Wrong credential');
        }
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    })
});

app.listen(4000);