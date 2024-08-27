const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const PostModel = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMW = multer({dest: 'uploads/'});
const fs = require('fs');


const salt = bcrypt.genSaltSync(10);
const secret = 'conmeo123';

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

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
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
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

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMW.single('file'), async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await PostModel.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        })
        res.json(postDoc);
    })


    
});

app.get('/post', async (req, res) => { 
    res.json(
        await PostModel.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
    );
})

app.listen(4000);