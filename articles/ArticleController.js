const express = require('express');
const router = express.Router();

router.get('/articles', (req, res)=>[
    res.send('<h1>Rota de artigos</h1>')
]);

router.get('/admin/article/new', (req, res)=>{
    res.render('/admin/articles/new');
});


module.exports = router;