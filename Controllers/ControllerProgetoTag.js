const db = require('../Config/Db');
const path = require('path');

module.exports = {
    // Create
    async postCreate(req, res) {
        try {
            const projetoId = req.params.projetoId || req.body.projetoId;
            const tagId = req.params.tagId || req.body.tagId;
            
            console.log('Creating ProjetoTag with:', { projetoId, tagId });
            
            if (!projetoId || !tagId) {
                console.log('Missing projetoId or tagId');
                return res.redirect('/home');
            }

            // Use the Projeto model's association method
            const projeto = await db.Projeto.findByPk(projetoId);
            if (!projeto) {
                console.log('Projeto not found:', projetoId);
                return res.redirect('/home');
            }

            await projeto.addTag(tagId);
            return res.redirect('/atualizarProjeto/' + projetoId);
        } catch (err) {
            console.error('Error in postCreate:', err);
            return res.redirect('/home');
        }
    },

    //Delete
    async getDelete(req, res) {
        await db.Tag.destroy({ where: { id: req.params.id } }).then(
            () => res.redirect('/listarTag')
        ).catch(err => { console.log(err); });
    }
}