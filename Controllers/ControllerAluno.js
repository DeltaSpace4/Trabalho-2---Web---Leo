const db = require('../Config/Db');
const path = require('path');

module.exports = {

    // Login
    async getLogin(req, res) {
        res.render('aluno/login', { layout: 'noMenu.handlebars' });
    },
    async getLogout(req, res) {
        //res.cookie("userData", req.cookies.userData, { maxAge: 0, httpOnly: true });
        req.session.destroy();
        res.redirect('/');
    },

    async postLogin(req, res) {
        var user = { login: req.body.login }
        db.Usuario.findAll({ where: { login: req.body.login, senha: req.body.senha } }
        ).then(usuarios => {
            if (usuarios.length > 0) {
                //res.cookie("userData", user, { maxAge:30 * 60 * 1000, httpOnly: true }); //qual o ponto disso?
                req.session.login = req.body.login;
                res.locals.login = req.body.login; 
                if (usuarios[0].dataValues.tipo == 2) {
                    req.session.tipo = usuarios[0].dataValues.tipo;
                    res.locals.admin = true;
                }
                res.render('home');
            } else res.redirect('/');
        }).catch((err) => { console.log(err); });
    },

    // Create
    async getCreate(req, res) {
        res.render('aluno/alunoCreate'); //////// Verificar isso
    },
    async postCreate(req, res) {
        db.Usuario.create(req.body).thesn(() => {
            res.redirect('/home');
        }).catch((err) => { console.log(err); });
    },

    // List
    async getList(req, res) {
        db.Usuario.findAll().then(usuario => {
            res.render('categoria/categoriaList', { categorias: categorias.map(catg => catg.toJSON()) });
        }).catch((err) => { console.log(err); });
    },
    async getUpdate(req, res) {
        await db.Usuario.findByPk(req.params.id).then(
            categoria => res.render('categoria/categoriaUpdate', {categoria: categoria.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.Usuario.update(req.body, { where: { id: req.body.id } }).then(
            res.render('home')
        ).catch(function (err) { console.log(err); });
    },
    async getDelete(req, res) {
        await db.Usuario.destroy({ where: { id: req.params.id } }).then(
            res.render('home')
        ).catch(err => { console.log(err); });
    }
}   