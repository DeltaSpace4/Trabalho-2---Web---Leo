const db = require('../Config/Db');
const path = require('path');

module.exports = {
    // Create
    async getCreate(req, res) {
        res.render('Tag/TagCreate');
    },
    async postCreate(req, res) {
        db.Tag.create(req.body).then(() => {
            res.redirect('/Home');
        }).catch((err) => { console.log(err); });
    },

    // List
    async getList(req, res) {
        db.Tag.findAll().then(tag => {
            res.render('Tag/TagList', { tag: tag.map(TagPar => TagPar.toJSON()) });
        }).catch((err) => { console.log(err); });
    },

    //Update
    async getUpdate(req, res) {
        await db.Tag.findByPk(req.params.id).then(
            tag => res.render('Tag/TagUpdate', { tag: tag.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.Tag.update(req.body, { where: { id: req.body.id } }).then(
            () => res.render('Home')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.Tag.destroy({ where: { id: req.params.id } }).then(
            () => res.render('Home')
        ).catch(err => { console.log(err); });
    }
}