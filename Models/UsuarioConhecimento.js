module.exports = (sequelize, Sequelize) => {
    const UsuarioConhecimento = sequelize.define('usuario_conhecimento', {    
        Dominio: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })
    return UsuarioConhecimento;
}