module.exports = (sequelize, Sequelize) => {
    const UsuarioConhecimento = sequelize.define('usuario_conhecimento', {    
        dominio: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
    return UsuarioConhecimento;
}