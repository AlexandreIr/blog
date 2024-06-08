const Sequelize = require('sequelize');
const connection = new Sequelize('posts', 'Alexandre', '46422278As@$',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;