const express = require('express');
const router = express.Router();
const category = require('./Category');
const slugify = require('slugify');

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

module.exports = router;