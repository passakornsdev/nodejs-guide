const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('node_complete', 'passakorn', 'nodejs-guide', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
