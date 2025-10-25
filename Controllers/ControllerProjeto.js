const db = require('../Config/Db');
const path = require('path');
const logProjeto = require('../Models/NoSql/LogProjeto');

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
            const projeto = await db.Projeto.create(req.body);
            
            const usuario = await db.Usuario.findOne({
                where: { email: req.session.email }
            });

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            // Vincular o projeto ao usuário que o criou
            await projeto.addUsuario(usuario);
            
            //log mongo
            await logProjeto.logarProjeto('Projeto '+req.body.nome+' Criado', req.session.userId, req.session.email);

            res.redirect('/home');
        }
         catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    },

    // List
    async getList(req, res) {
        try {
            const projetos = await db.Projeto.findAll();

            // Buscar as vinculações do usuário atual
            const userLinks = await db.UsuarioProjeto.findAll({
                where: {
                    usuarioId: req.session.userId
                }
            });

            // Criar um Set dos IDs de projetos que o usuário tem acesso
            const userProjectIds = new Set(userLinks.map(link => link.projetoId));

            const projetosProcessados = projetos.map(projeto => {
                const projetoJSON = projeto.toJSON();
                // Usuário pode editar se for admin ou se estiver vinculado ao projeto
                projetoJSON.canEdit = req.session.tipo === 'admin' || userProjectIds.has(projeto.id);
                if (userProjectIds.has(projeto.id)) {
                    projetoJSON.canEdit = true;
                }
                return projetoJSON;
            });

            res.render('projeto/listarProjeto', { 
                projeto: projetosProcessados,
                admin: req.session.tipo === 'admin'
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    },

    //Update
    async getUpdate(req, res) {
        try {
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

            const linkedTagIds = projeto.Tags ? projeto.Tags.map(t => t.id) : [];
            const linkedUserIds = projeto.Usuarios ? projeto.Usuarios.map(u => u.id) : [];

            const tagsWithFlag = tags.map(t => {
                const json = t.toJSON();
                json.linked = linkedTagIds.includes(json.id);
                return json;
            });

            // determinar permissão de edição por admin ou vínculo de usuário
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