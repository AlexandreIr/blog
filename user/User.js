const sequelize = require('sequelize');
const connection = require('../db/db');

const User = connection.define('users', {
    name:{
        type: sequelize.STRING,
        allowNull:false
    }, email:{
        type: sequelize.STRING,
        allowNull:false
    }, password:{
        type: sequelize.STRING,
        allowNull:false
    }
});

module.exports = User;