const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const { where } = require('sequelize');


router.get('/admin/users',(req, res)=>{
    User.findAll().then(users=>{
        res.render('admin/users/index', {users:users});
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

router.post('/admin/users/delete/:id', (req, res)=>{
    const id = req.params.id;
    if(id!=null && !isNaN(id)){
        User.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect('/admin/users');
        })
    }
});

module.exports = router;