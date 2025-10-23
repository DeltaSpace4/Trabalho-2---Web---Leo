const Sequelize = require('sequelize');
const sequelize = new Sequelize('prova', 'postgres', '123', {host: 'localhost',dialect: 'postgres'});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Usuario = require('../Models/Usuario.js')(sequelize, Sequelize);
db.Projeto = require('../Models/Projeto.js')(sequelize, Sequelize);
db.Conhecimento = require('../Models/Conhecimento.js')(sequelize, Sequelize);
db.Tag = require('../Models/Tag.js')(sequelize, Sequelize);
db.ProjetoTag = require('../Models/ProjetoTag.js')(sequelize, Sequelize);

// Relacionamentos entre as tabelas -- Atualizar

db.Projeto.belongsToMany(db.Tag, { through: db.ProjetoTag });
db.Tag.belongsToMany(db.Projeto, { through: db.ProjetoTag });
db.Projeto.belongsToMany(db.Usuario, { through: 'UsuarioProjetos' });
db.Usuario.belongsToMany(db.Projeto, { through: 'UsuarioProjetos' });
db.Conhecimento.belongsToMany(db.Usuario, { through: 'UsuarioConhecimentos' });
db.Usuario.belongsToMany(db.Conhecimento, { through: 'UsuarioConhecimentos' });

module.exports = db;

