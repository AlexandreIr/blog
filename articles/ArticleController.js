const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const slugify = require('slugify');
const Article = require('./Article');

router.get('/articles', (req, res)=>{
    Article.findAll({raw:true}).then(art=>{
        res.render('./admin/articles/index', {
            articles:art
        });
    })
})

router.get('/admin/article/new', (req, res)=>{
    res.render('./admin/articles/new');
});
router.post('/admin/article/new', (req, res)=>{
    const title = req.body.title;
    const body = req.body.body;

    if(title!=null && body!=null){
        Article.create({
            title:title,
            slug:slugify(title),
            body:body
        }).then(()=>{
            res.redirect('/articles');
        })
    } else {
        res.redirect('/admin/article/new');
    }
});



module.exports = router;