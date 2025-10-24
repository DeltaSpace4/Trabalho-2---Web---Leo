const db = require('../Config/Db');
const path = require('path');

module.exports = {
    //Create
    async getCreate(req, res) {
        res.render('tag/criarTag');
    },
    async postCreate(req, res) {
        db.Tag.create(req.body).then(() => {
            res.redirect('/home');
        }).catch((err) => { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.UsuarioProjeto.destroy({ where: { id: req.params.id } }).then(
            () => res.render('home')
        ).catch(err => { console.log(err); });
    }
}