const sequelize = require('sequelize');
const connection = require ('../db/db');
const Article = require('../articles/Article');

const Comment = define('comentaries', {
    name:{
        type:sequelize.STRING,
        allowNull:false
    },email:{
        type:sequelize.STRING,
        allowNull:false
    },body:{
        type:sequelize.STRING,
        allowNull:false
    }
});

Article.hasMany(Comment);
Comment.belongsTo(Article);

module.exports = Comment;