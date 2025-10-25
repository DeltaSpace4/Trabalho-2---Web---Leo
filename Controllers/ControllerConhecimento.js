const db = require('../Config/Db');
const path = require('path');
const LogConhecimento = require('../Models/NoSql/LogConhecimento');

module.exports = {
    // Create
    async getCreate(req, res) {
        res.render('conhecimento/criarConhecimento');
    },
    async postCreate(req, res) {
        db.Conhecimento.create(req.body).then(() => {

            //log mongo
            logConhecimento.logarConhecimento('Conhecimento '+req.body.titulo+' Criado', req.session.userId, req.session.email);
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
            logConhecimento.logarConhecimento('Conhecimento '+req.body.titulo+' Atualizado', req.session.userId, req.session.email),
            () => res.redirect('/listarConhecimento')
        ).catch(function (err) { console.log(err); });
    },

    //Delete    
    async getDelete(req, res) {
        //
        await db.Conhecimento.destroy({ where: { id: req.params.id } }).then(
            () => res.redirect('/listarConhecimento')
        ).catch(err => { console.log(err); });
    }
}