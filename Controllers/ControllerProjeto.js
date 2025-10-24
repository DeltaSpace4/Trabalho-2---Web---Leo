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
        db.Projeto.create(req.body).then(() => {
            res.redirect('/home');
        }).catch((err) => { console.log(err); });
    },

    // List
    async getList(req, res) {
        db.Projeto.findAll().then(projeto => {
            res.render('projeto/listarProjeto', { projetos: projeto.map(pr => pr.toJSON()) });
        }).catch((err) => { console.log(err); });
    },

    //Update
    async getUpdate(req, res) {
        await db.Projeto.findByPk(req.params.id).then(
            projeto => res.render('projeto/atualizarProjeto', { projeto: projeto.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.Projeto.update(req.body, { where: { id: req.body.id } }).then(
            () => res.render('home')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.Projeto.destroy({ where: { id: req.params.id } }).then(
            () => res.render('home')
        ).catch(err => { console.log(err); });
    }
}