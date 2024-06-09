const express = require('express');
const router = express.Router();

router.get('/categories', (req, res)=>{
    res.send('<h1>Categorias</h1>')
});

router.get('/admin/categories/new', (req, res)=>{
    res.send('<h1>Nova categoria</h1>')

});

module.exports = router;