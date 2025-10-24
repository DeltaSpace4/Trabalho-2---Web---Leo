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
    },

    // Remove association between projeto and tag
    async remove(req, res) {
        try {
            const projetoId = req.params.projetoId;
            const tagId = req.params.tagId;

            if (!projetoId || !tagId) {
                console.log('Missing projetoId or tagId for remove');
                return res.redirect('/home');
            }

            const projeto = await db.Projeto.findByPk(projetoId);
            if (!projeto) {
                console.log('Projeto not found for remove:', projetoId);
                return res.redirect('/home');
            }

            await projeto.removeTag(tagId);
            return res.redirect('/atualizarProjeto/' + projetoId);
        } catch (err) {
            console.error('Error removing ProjetoTag:', err);
            return res.redirect('/home');
        }
    },

    // Bulk update associations: replace project's tags with provided tagIds
    async updateMany(req, res) {
        try {
            const projetoId = req.body.projetoId || req.params.projetoId;
            // tagIds can be an array (multiple checkboxes) or a single value
            let tagIds = req.body.tagIds || req.body.tags;

            if (!projetoId) {
                console.log('Missing projetoId for updateMany');
                return res.redirect('/home');
            }

            // normalize tagIds to array of integers
            if (!tagIds) {
                tagIds = [];
            } else if (!Array.isArray(tagIds)) {
                tagIds = [tagIds];
            }

            // Convert to integers
            tagIds = tagIds.map(id => parseInt(id, 10)).filter(Boolean);

            const projeto = await db.Projeto.findByPk(projetoId);
            if (!projeto) {
                console.log('Projeto not found for updateMany:', projetoId);
                return res.redirect('/home');
            }

            // Replace associations in one operation
            await projeto.setTags(tagIds);

            return res.redirect('/atualizarProjeto/' + projetoId);
        } catch (err) {
            console.error('Error in updateMany:', err);
            return res.redirect('/home');
        }
    }
}