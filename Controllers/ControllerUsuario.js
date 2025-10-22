const db = require('../Config/Db');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {

    // Login
    async getLogin(req, res) {
        res.render('usuario/login', { layout: 'noMenu.handlebars' });
    },
    async getLogout(req, res) {
        //res.cookie("userData", req.cookies.userData, { maxAge: 0, httpOnly: true });
        req.session.destroy();
        res.redirect('/');
    },

    async postLogin(req, res) {
        var user = { login: req.body.login }
        db.Usuario.findAll({ where: { login: req.body.login, senha: req.body.senha } }
        ).then(usuario => {
            if (usuario.length > 0) {
                //res.cookie("userData", user, { maxAge:30 * 60 * 1000, httpOnly: true }); //qual o ponto disso?
                req.session.login = req.body.login;
                res.locals.login = req.body.login; 
                if (usuario[0].dataValues.tipo == 2) {
                    req.session.tipo = usuario[0].dataValues.tipo;
                    res.locals.admin = true;
                }
                res.render('home');
            } else res.redirect('/');
        }).catch((err) => { console.log(err); });
    },

    // Create
    async getCreate(req, res) {
        res.render('usuario/usuarioCreate'); //////// Verificar isso
    },
    async postCreate(req, res) {
        db.Usuario.create(req.body).then(() => {
            res.redirect('/home');
        }).catch((err) => { console.log(err); });
    },

    async postCreate(req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);
            await db.Usuario.create({
                ...req.body,
                senha: hashedPassword
            });
            res.redirect('/home');
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            res.status(500).send('Erro ao criar usuário');
        }
    },

    // List
    async getList(req, res) {
        db.Usuario.findAll().then(usuario => {
            res.render('usuario/usuarioList', { usuario: usuario.map(user => user.toJSON()) });
        }).catch((err) => { console.log(err); });
    },

    //Update
    async getUpdate(req, res) {
        await db.Usuario.findByPk(req.params.id).then(
            usuario => res.render('usuario/usuarioUpdate', {usuario: usuario.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.Usuario.update(req.body, { where: { id: req.body.id } }).then(
            res.render('home')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.Usuario.destroy({ where: { id: req.params.id } }).then(
            res.render('home')
        ).catch(err => { console.log(err); });
    }
}   