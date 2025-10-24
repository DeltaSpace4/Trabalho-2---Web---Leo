const db = require('../Config/Db');
const path = require('path');

module.exports = {
    async updateMany(req, res) {
        try {
            const projetoId = req.body.projetoId;
            const usuarioIds = Array.isArray(req.body.usuarioIds) ? req.body.usuarioIds : [req.body.usuarioIds].filter(Boolean);

            // Buscar o projeto
            const projeto = await db.Projeto.findByPk(projetoId);
            if (!projeto) {
                return res.status(404).json({ error: 'Projeto não encontrado' });
            }

            // Atualizar os usuários vinculados
            await projeto.setUsuarios(usuarioIds);

            res.redirect(`/atualizarProjeto/${projetoId}`);
        } catch (err) {
            console.error('Erro ao atualizar usuários do projeto:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Outros métodos existentes que você queira manter
    async getDelete(req, res) {
        try {
            await db.UsuarioProjeto.destroy({ where: { id: req.params.id } });
            res.redirect('/home');
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
}