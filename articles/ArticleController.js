const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const slugify = require('slugify');
const Article = require('./Article');
const Category = require('../categories/Category');
const { raw } = require('body-parser');

router.get('/articles', (req, res)=>{
    Article.findAll({
        include:[{model:Category}]
    }).then(art=>{
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
        const category = Category.findAll({raw:true}).then(categ=>{
            if(art!=null){
                res.render('admin/articles/edit', {
                    article: art,
                    categories:categ
                });
            } else {
                res.redirect('/articles');
            }
        });
    });
});
router.post('/articles/edit/:id', (req,res)=>{
    const id = req.params.id;
    const title = req.body.title;
    const body = req.body.article;
    const category = req.body.category;
    Article.update({
        title:title,
        slug:slugify(title),
        body:body,
        category:category
    }, {
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect('/articles');
    });
});

router.post('/articles/delete/:id', (req, res)=>{
    const id = req.params.id;
    if(!isNaN(id) && id!=null){
        Article.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect('/articles');
        })
    } 
});

router.get('/:slug', (req, res)=>{
    const slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        res.render('admin/articles/read', {
            article:article
        });
    });
})



module.exports = router;