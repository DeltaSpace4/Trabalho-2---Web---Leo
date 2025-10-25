const db = require('../Config/Db');
const path = require('path');
const logConhecimento = require('../Models/noSql/LogConhecimento');

module.exports = {
    // Create
    async getCreate(req, res) {
        res.render('conhecimento/criarConhecimento');
    },
    async postCreate(req, res) {
        db.Conhecimento.create(req.body).then(() => {

            //log mongo
            logConhecimento.logarConhecimento('Conhecimento '+req.body.nome+' criado', req.session.userId, req.session.email);
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
        await db.Conhecimento.update(req.body, { where: { id: req.body.id } }).then(() => 
            logConhecimento.logarConhecimento('Conhecimento '+req.body.nome+' atualizado', req.session.userId, req.session.email),
            res.redirect('/listarConhecimento')
        ).catch(function (err) { console.log(err); });
    },

    //Delete    
    async getDelete(req, res) {
    //log mongo se tiver await o delet tem prioridade
            db.Conhecimento.findOne({ where: { id: req.params.id } }).then(
            logConhecimento.logarConhecimento('Conhecimento '+req.params.id+' deletado', req.session.userId, req.session.email))
        await db.Conhecimento.destroy({ where: { id: req.params.id } }).then(
            () => res.redirect('/listarConhecimento')
        ).catch(err => { console.log(err); });
    }
}