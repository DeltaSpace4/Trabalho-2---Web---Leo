const db = require('../Config/Db');
const path = require('path');

module.exports = {
    // Create
    async getCreate(req, res) {
        res.render('conhecimento/criarConhecimento');
    },
    async postCreate(req, res) {
        db.Conhecimento.create(req.body).then(() => {
            res.redirect('/home');
        }).catch((err) => { console.log(err); });
    },

    // List
    async getList(req, res) {
        db.Conhecimento.findAll().then(conhecimento => {
            res.render('conhecimento/listarConhecimento', { conhecimentos: conhecimento.map(c => c.toJSON()) });
        }).catch((err) => { console.log(err); });
    },

    //Update
    async getUpdate(req, res) {
        await db.Conhecimento.findByPk(req.params.id).then(
            conhecimento => res.render('conhecimento/atualizarConhecimento', { conhecimento: conhecimento.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.Conhecimento.update(req.body, { where: { id: req.body.id } }).then(
            () => res.render('home')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.Conhecimento.destroy({ where: { id: req.params.id } }).then(
            () => res.render('home')
        ).catch(err => { console.log(err); });
    }
}