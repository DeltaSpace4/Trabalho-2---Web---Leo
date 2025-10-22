module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    }
  });
  return Tag;
}