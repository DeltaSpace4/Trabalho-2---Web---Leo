const db = require('../Config/Db');
const path = require('path');

module.exports = {

    //Update
    async getUpdate(req, res) {
        await db.UsuarioConhecimento.findByPk(req.params.id).then(
            conhecimento => res.render('usuarioConhecimento/atualizarUsuarioConhecimento', { conhecimento: conhecimento.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.UsuarioConhecimento.update(req.body, { where: { id: req.body.id } }).then(
            () => res.render('home')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.UsuarioConhecimento.destroy({ where: { id: req.params.id } }).then(
            () => res.render('home')
        ).catch(err => { console.log(err); });
    }
}