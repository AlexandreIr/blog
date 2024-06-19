const express = require('express');
const router = express.Router();
const User = require('./User');


router.get('/admin/users',(req, res)=>{
    User.findAll().then(users=>{
        res.json(users);
    });
});

router.get('/admin/users/create', (req, res)=>{
    res.render('admin/users/create');
});

router.post('/admin/users/create', (req, res)=>{
    const {name,email,password} = req.body;
    User.create({
        name:name,
        email:email,
        password:password
    }).then(()=>{
        res.redirect('/admin/users');
    })
});

module.exports = router;