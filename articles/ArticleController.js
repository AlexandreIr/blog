const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const slugify = require('slugify');
const Article = require('./Article');
const Category = require('../categories/Category');

router.get('/articles', (req, res)=>{
    Article.findAll({raw:true}).then(art=>{
        res.render('./admin/articles/index', {
            articles:art,
        });
    })
})

router.get('/admin/article/new', (req, res)=>{
    Category.findAll({raw:true}).then(cat=>{
        res.render('./admin/articles/new', {
            categories:cat
        });
    })
});

router.post('/admin/article/new', (req, res)=>{
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    if(title!=null && body!=null){
        Article.create({
            title:title,
            slug:slugify(title),
            categoryId:category,
            body:body
        }).then(()=>{
            res.redirect('/articles');
        })
    } else {
        res.redirect('/admin/article/new');
    }
});

router.get('/articles/edit/:id', (req, res)=>{
    const id = req.params.id;
    Article.findByPk(id).then((art)=>{
        const category = Category.findByPk(art.categoryId).then(cat=> {return cat});
        if(art!=null){
            res.render('admin/articles/edit', {
                article: art,
                category:category
            });
        } else {
            res.redirect('/articles');
        }
    });
});



module.exports = router;