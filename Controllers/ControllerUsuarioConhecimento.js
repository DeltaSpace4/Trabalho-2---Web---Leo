const db = require('../Config/Db');
const path = require('path');
const logUsuario = require('../Models/NoSql/LogUsuario');
const { log } = require('console');

module.exports = {

    //Update
    async getUpdate(req, res) {
        await db.UsuarioConhecimento.findByPk(req.params.id).then(
            conhecimento => res.render('usuarioConhecimento/atualizarUsuarioConhecimento', { conhecimento: conhecimento.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.UsuarioConhecimento.update(req.body, { where: { id: req.body.id } }).then(
            // mongo log
            logUsuario.logarUsuario('Usuario teve o Conhecimento ID '+req.body.id+' Atualizado', req.session.userId, req.session.email),    
            () => res.render('home')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.UsuarioConhecimento.destroy({ where: { id: req.params.id } }).then(
            // mongo log
            logUsuario.logarUsuario('Usuario teve o Conhecimento ID '+req.params.id+' Deletado', req.session.userId, req.session.email),
            () => res.render('home')
        ).catch(err => { console.log(err); });
    }
}