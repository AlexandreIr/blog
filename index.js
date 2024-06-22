const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./db/db');

const CategoryController = require('./categories/CategoryController');
const ArticleController = require('./articles/ArticleController');
const UsersController = require('./user/UsersController');

const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./user/User');
const { where } = require('sequelize');

const port = 8080;

app.set('view engine', 'ejs');

app.use(session({
    secret:'ajdfhiasufsa6g45645sd1g2dfs85gsdffssdfg',
    cookie:{maxAge: 300*1000}
}));

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
app.use('/', UsersController);

app.get('/', (req, res)=>{
    Article.findAll({
        include:[{model:Category}],
        limit:2
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
});

app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`);
});