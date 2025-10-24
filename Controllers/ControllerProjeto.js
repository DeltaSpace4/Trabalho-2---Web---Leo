const db = require('../Config/Db');
const path = require('path');

module.exports = {
    // Create
    async getCreate(req, res) {
        var tag = await db.Tag.findAll()
        res.render('projeto/criarProjeto', {
            tag: tag.map(tag => tag.toJSON())
        });
    },
    async postCreate(req, res) {
        try {
            // Primeiro, criar o projeto
            const projeto = await db.Projeto.create(req.body);
            
            // Encontrar o usuário atual
            const usuario = await db.Usuario.findOne({
                where: { email: req.session.email }
            });

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            // Vincular o projeto ao usuário que o criou
            await projeto.addUsuario(usuario);

            res.redirect('/home');
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    },

    // List
    async getList(req, res) {
        db.Projeto.findAll().then(projeto => {
            res.render('projeto/listarProjeto', { projeto: projeto.map(pr => pr.toJSON()) });
        }).catch((err) => { console.log(err); });
    },

    //Update
    async getUpdate(req, res) {
        try {
            // Load projeto including its Tags and Usuarios
            const projeto = await db.Projeto.findByPk(req.params.id, {
                include: [
                    { model: db.Tag },
                    { model: db.Usuario }
                ]
            });
            const tags = await db.Tag.findAll();

            if (!projeto) {
                console.log('Projeto not found:', req.params.id);
                return res.redirect('/listarProjeto');
            }

            const projetoData = projeto.dataValues;

            // Collect linked tag ids and user ids
            const linkedTagIds = projeto.Tags ? projeto.Tags.map(t => t.id) : [];
            const linkedUserIds = projeto.Usuarios ? projeto.Usuarios.map(u => u.id) : [];

            // Add linked flag to tags
            const tagsWithFlag = tags.map(t => {
                const json = t.toJSON();
                json.linked = linkedTagIds.includes(json.id);
                return json;
            });

            // Determine if user can edit based on admin status or project association
            const canEdit = req.session.tipo === 'admin' || 
                          (projeto.Usuarios && 
                           projeto.Usuarios.some(u => u.email === req.session.email));

            return res.render('projeto/atualizarProjeto', {
                projeto: projetoData,
                tag: tagsWithFlag,
                canEdit: canEdit
            });
        } catch (err) {
            console.log(err);
            return res.redirect('/listarProjeto');
        }
    },
    async postUpdate(req, res) {
        await db.Projeto.update(req.body, { where: { id: req.body.id } }).then(
            () => res.redirect('/listarProjeto')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.Projeto.destroy({ where: { id: req.params.id } }).then(
            () => res.redirect('/listarProjeto')
        ).catch(err => { console.log(err); });
    }
}