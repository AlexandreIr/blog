const express = require('express');
const router = express.Router();
const category = require('./Category');
const slugify = require('slugify');
const { raw } = require('body-parser');

router.get('/admin/categories/new', (req, res)=>{
    res.render('./admin/categories/new');
});

router.post('/admin/categories/new', (req, res)=>{
    const title = req.body.title;
    if(title!=null){
        category.create({
            title:title,
            slug:slugify(title)
        }).then(()=>{
            res.redirect('/');
        })
    }else {
        res.redirect('/admin/categories/new');
    }
});
router.get('/categories', (req, res)=>{
    category.findAll({raw:true}).then(cat=>{
        res.render('./admin/categories/index',{
            categories:cat
        });
    });
});

module.exports = router;