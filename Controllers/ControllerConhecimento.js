const db = require('../Config/Db');
const path = require('path');
//const db_mongoose = require('./Config/Db_mongoose');

async function LogarConhecimento(texto, req) {
    try {
        await LogConhecimento.create({
            texto,
            modificadorId: req.session.idUsuario,
            modificadorEmail: req.session.email
        });
    } catch (err) {
        console.error("Erro ao logar conhecimento:", err);
    }
}

module.exports = {
    // Create
    async getCreate(req, res) {
        res.render('conhecimento/criarConhecimento');
    },
    async postCreate(req, res) {
        db.Conhecimento.create(req.body).then(() => {
            LogarConhecimento( 'Conhecimento "${conhecimento.titulo}" foi criado.', req );
            res.redirect('/home');
        }).catch((err) => { console.log(err); });
    },

    // List
    async getList(req, res) {
        db.Conhecimento.findAll().then(conhecimento => {
            res.render('conhecimento/listarConhecimento', { conhecimento: conhecimento.map(c => c.toJSON()) });
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
            () => res.redirect('/listarConhecimento')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.Conhecimento.destroy({ where: { id: req.params.id } }).then(
            () => res.redirect('/listarConhecimento')
        ).catch(err => { console.log(err); });
    }
}