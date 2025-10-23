module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    senha: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    tipo: { 
        type: Sequelize.ENUM('aluno','admin'), 
        defaultValue: 'aluno' 
    },
    ativo: { 
        type: Sequelize.BOOLEAN, 
        defaultValue: true 
    },
    link: {
        type: Sequelize.STRING
    }
  });
  return Usuario;
}