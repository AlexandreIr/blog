const express = require('express');
const app = express();
const port = 8079;

app.get('/', (req, res)=>{
    res.send('<h1>Olá mundo</h1>');
});

app.listen(port, ()=>{
    console.log(`Servidor rodando em ${port}`);
});