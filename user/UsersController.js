const express = require('express');
const Categoies = require('../categories/Category');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const { where } = require('sequelize');


router.get('/login', (req, res)=>{
    Categoies.findAll().then((categories)=>{
        res.render('admin/users/login', {categories:categories});
    })
});

router.post('/login', (req, res)=>{
    const {email,password} = req.body;
    User.findOne({
        where:{
            email:email,
        }
    }).then(user=>{
        if(user!=null){
            const verification = bcrypt.compareSync(password, user.password);
            if(verification){
                req.session.user = {
                    id:user.id,
                    name:user.name,
                    email:user.email,
                }
                res.json(req.session.user);
            } else {
                res.redirect('/login');
 
            }
        } else {
            res.redirect('/');
        }
    })
})


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