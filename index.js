const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./db/db');

const port = 8080;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connection.authenticate().then(()=>{
    console.log('Conhexão realizada com sucesso!');
}).catch(error=>{
    console.log(error);
})

app.get('/', (req, res)=>{
    res.render('index');
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
});