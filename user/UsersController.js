const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');


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

    User.findOne({
        where:{
            email:email
        }
    }).then(u=>{
        if(u==null){
            const salt = bcrypt.genSaltSync(11);
            const hash = bcrypt.hashSync(password, salt);
            User.create({
                name:name,
                email:email,
                password:hash
            }).then(()=>{
                res.redirect('/admin/users');
            })
        } else {
            res.redirect('/admin/users/create');
        } 
    })
});

module.exports = router;