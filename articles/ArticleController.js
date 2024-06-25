const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const slugify = require('slugify');
const Article = require('./Article');
const Category = require('../categories/Category');
const { raw } = require('body-parser');
const adminAuth = require('../middlewares/adminAuth');

router.get('/articles', adminAuth ,(req, res)=>{
    Article.findAll({
        include:[{model:Category}]
    }).then(art=>{
            res.render('./admin/articles/index', {
                articles:art,
            });
    })
})

router.get('/admin/article/new',adminAuth ,(req, res)=>{
    Category.findAll({raw:true}).then(cat=>{
        res.render('./admin/articles/new', {
            categories:cat
        });
    })
});

router.post('/admin/article/new',adminAuth ,(req, res)=>{
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

router.get('/articles/edit/:id',adminAuth ,(req, res)=>{
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
router.post('/articles/edit/:id',adminAuth ,(req,res)=>{
    const id = req.params.id;
    const {title, article, category} = req.body
    
    Article.update({
        title:title,
        slug:slugify(title),
        body:article,
        categoryId:category
    }, {
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect('/articles');
    });
});

router.post('/articles/delete/:id', adminAuth,(req, res)=>{
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

router.get('/article/:slug', (req, res)=>{
    const slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        Category.findAll().then(categories=>{
            res.render('admin/articles/read', {
                article:article,
                categories:categories
            });
        })
    });
});

router.get('/articles/page/:num', (req, res)=>{
    const page = req.params.num;
    let offset = 0;
    if(isNaN(page)||page==1){
        offset=0;
    } else{
        offset = (parseInt(page)-1)*4;    
    }

    Article.findAndCountAll({
        limit:4,
        offset,
    }).then(articles=>{
        let next = true;
        if(offset*4>=articles.count){
            next=false;
        }
        const result = {
            page:parseInt(page),
            next,
            articles
        }

        Category.findAll().then(categories=>{
            res.render('admin/articles/page',{
                result:result,
                categories:categories
            });
        })
    });
});



module.exports = router;