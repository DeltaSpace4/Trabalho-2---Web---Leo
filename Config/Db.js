const Sequelize = require('sequelize');
const sequelize = new Sequelize('prova', 'postgres', '123', {host: 'localhost',dialect: 'postgres'});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//////////////////////////////
db.Aluno = require('../Models/Aluno.js')(sequelize, Sequelize);
db.Projeto = require('../Models/Projeto.js')(sequelize, Sequelize);
db.Conhecimento = require('../Models/Conhecimento.js')(sequelize, Sequelize);
db.Tag = require('../Models/Tag.js')(sequelize, Sequelize);

// Relacionamentos entre as tabelas -- Atualizar
/* 
db.Aluno.belongsToMany(db.Disciplina, { through: db.Cadastro });
db.Disciplina.belongsToMany(db.Aluno, { through: db.Cadastro });
*/
module.exports = db;

