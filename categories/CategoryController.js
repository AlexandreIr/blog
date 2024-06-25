const express = require('express');
const router = express.Router();
const category = require('./Category');
const article = require('../articles/Article');
const slugify = require('slugify');
const { raw } = require('body-parser');
const { where } = require('sequelize');
const Category = require('./Category');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/categories/new', adminAuth,(req, res)=>{
    res.render('./admin/categories/new');
});

router.post('/admin/categories/new',adminAuth ,(req, res)=>{
    const title = req.body.title;
    if(title!=null){
        category.create({
            title:title,
            slug:slugify(title)
        }).then(()=>{
            res.redirect('/categories');
        })
    }else {
        res.redirect('/admin/categories/new');
    }
});
router.get('/categories', adminAuth,(req, res)=>{
    category.findAll({raw:true}).then(cat=>{
        res.render('./admin/categories/index',{
            categories:cat
        });
    });
});

router.post('/categories/delete/',adminAuth,(req, res)=>{
    const id = req.body.id;
    if(id!=null){
        if(!isNaN(id)){
            article.findAll({
                where:{
                    categoryId:id
                }
            }).then(articles=>{
                articles.forEach(art=>{
                    art.destroy();
                })
            });
            
            category.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect('/categories');
            });
        } else{
            res.redirect('/categories');
        }
    }else {
        res.redirect('/categories');
    }
});

router.get('/categories/edit/:id',adminAuth, (req, res)=>{
    const id = req.params.id;
    if(isNaN(id)){
        res.redirect('/categories');
    }
    category.findByPk(id).then(cat=>{
        if(cat!=null){
            res.render('admin/categories/edit', {categ:cat});
        } else{
            res.redirect('/categories');
        }
    }).catch(error=>{
        res.redirect('/categories');
    })
});

router.post('/categories/edit/:id',adminAuth,(req, res)=>{
    const id = req.params.id;
    const title = req.body.title;
    Category.update({title:title, slug:slugify(title)}, {
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect('/categories');
    });
})

module.exports = router;