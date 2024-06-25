const express = require('express');
const Categoies = require('../categories/Category');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
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
                res.redirect('/articles');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    }).catch(err=>{
        console.log(err);
    })
})


router.get('/admin/users',adminAuth,(req, res)=>{
    User.findAll().then(users=>{
        res.render('admin/users/index', {users:users});
    });
});

router.get('/admin/users/create',adminAuth, (req, res)=>{
    res.render('admin/users/create');
});

router.post('/admin/users/create',adminAuth, (req, res)=>{
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
                name,
                email,
                password:hash
            }).then(()=>{
                res.redirect('/admin/users');
            })
        } else {
            res.redirect('/admin/users/create');
        } 
    })
});

router.post('/admin/users/delete/:id',adminAuth, (req, res)=>{
    const id = req.params.id;
    if(id!=null && !isNaN(id)){
        User.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            if(req.session.user.id!=id){
                res.redirect('/admin/users');
            } else {
                res.redirect('/logout');
            }
        })
    }
});

router.get('/logout',adminAuth, (req, res)=>{
    req.session.user=undefined;
    res.redirect('/');
})

module.exports = router;