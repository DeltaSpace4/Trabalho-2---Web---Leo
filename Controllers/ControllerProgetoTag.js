const db = require('../Config/Db');
const path = require('path');
const logProjeto = require('../Models/NoSql/LogProjeto');

module.exports = {
    // Create
    async postCreate(req, res) {
        try {
            const projetoId = req.params.projetoId || req.body.projetoId;
            const tagId = req.params.tagId || req.body.tagId;
            
            console.log('Criando ProjetoTag com:', { projetoId, tagId });
            
            if (!projetoId || !tagId) {
                console.log('Faltando projetoId or tagId');
                return res.redirect('/home');
            }

            const projeto = await db.Projeto.findByPk(projetoId);
            if (!projeto) {
                console.log('Projeto não encontrado:', projetoId);
                return res.redirect('/home');
            }

            await projeto.addTag(tagId);

            //mongo log
            await logProjeto.logarProjeto('Tag ID '+tagId+' vinculada ao Projeto ID '+projetoId, req.session.userId, req.session.email);

            return res.redirect('/atualizarProjeto/' + projetoId);
        } catch (err) {
            console.error('Erro em postCreate:', err);
            return res.redirect('/home');
        }
    },

    //Delete
    async getDelete(req, res) {
        await db.Tag.destroy({ where: { id: req.params.id } }).then(
            () => res.redirect('/listarTag')
        ).catch(err => { console.log(err); });
    },

    async remove(req, res) {
        try {
            const projetoId = req.params.projetoId;
            const tagId = req.params.tagId;

            if (!projetoId || !tagId) {
                console.log('Faltnado projetoId ou tagId para remover');
                return res.redirect('/home');
            }

            const projeto = await db.Projeto.findByPk(projetoId);
            if (!projeto) {
                console.log('Projeto não encontrado para remover:', projetoId);
                return res.redirect('/home');
            }

            await projeto.removeTag(tagId);

            //mongo log
            await logProjeto.logarProjeto('Tag ID '+tagId+' desvinculada do Projeto ID '+projetoId, req.session.userId, req.session.email);

            return res.redirect('/atualizarProjeto/' + projetoId);
        } catch (err) {
            console.error('Erro removendo ProjetoTag:', err);
            return res.redirect('/home');
        }
    },

    async updateMany(req, res) {
        try {
            const projetoId = req.body.projetoId || req.params.projetoId;
            let tagIds = req.body.tagIds || req.body.tags;

            if (!projetoId) {
                console.log('Faltando projetoId para updateMany');
                return res.redirect('/home');
            }

            if (!tagIds) {
                tagIds = [];
            } else if (!Array.isArray(tagIds)) {
                tagIds = [tagIds];
            }

            tagIds = tagIds.map(id => parseInt(id, 10)).filter(Boolean);

            const projeto = await db.Projeto.findByPk(projetoId);
            if (!projeto) {
                console.log('Projeto não encontrado para updateMany:', projetoId);
                return res.redirect('/home');
            }

            await projeto.setTags(tagIds);
            
            //Talvez daria para fazer um log mais detalhado aqui, verificar como que o updateMany está funcionando na prática
            await logProjeto.logarProjeto('Tags atualizadas para Projeto ID '+projetoId, req.session.userId, req.session.email);

            return res.redirect('/atualizarProjeto/' + projetoId);
        } catch (err) {
            console.error('Erro em updateMany:', err);
            return res.redirect('/home');
        }
    }
}