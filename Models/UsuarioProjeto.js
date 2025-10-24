module.exports = (sequelize, Sequelize) => {
    const UsuarioProjeto = sequelize.define('usuario_projeto', {
        usuarioId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        projetoId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'projetos',
                key: 'id'
            }
        }
    });
    return UsuarioProjeto;
}