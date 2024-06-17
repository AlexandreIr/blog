const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./db/db');

const CategoryController = require('./categories/CategoryController');
const ArticleController = require('./articles/ArticleController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const { where } = require('sequelize');

const port = 8080;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connection.authenticate().then(()=>{
    console.log('Conexão realizada com sucesso!');
}).catch(error=>{
    console.log(error);
})

app.use('/', CategoryController);
app.use('/', ArticleController);

app.get('/', (req, res)=>{
    Article.findAll({
        include:[{model:Category}],
        order:[['id', 'DESC']]
    }).then(art=>{
        Category.findAll().then(categories=>{
            res.render('index', {
                articles:art,
                categories:categories
            });
        })
    })
});

app.get('/category/:slug', (req, res)=>{
    const slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        }, 
        include:[{model:Article}]
    }).then(category=>{
        if(category!=null){
            Category.findAll().then(categories=>{
                res.render('index',{
                    articles:category.articles,
                    categories:categories
                });
            })
        }
    }).catch(err=>{
        res.redirect('/');
        console.log(err);
    });
})

app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`);
});