const db = require('../Config/Db');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {

    // Login
    async getLogin(req, res) {
        res.render('Usuario/Login', { layout: 'NoMenu.handlebars' });
    },
    async getLogout(req, res) {
        //res.cookie("userData", req.cookies.userData, { maxAge: 0, httpOnly: true });
        req.session.destroy();
        res.redirect('/');
    },

    async postLogin(req, res) {
        try {
            const user = await db.Usuario.findOne({ where: { login: req.body.login } });
            if (user && await bcrypt.compare(req.body.senha, user.senha)) {
                req.session.login = req.body.login;
                res.locals.login = req.body.login;
                if (user.dataValues.tipo == 2) {
                    req.session.tipo = user.dataValues.tipo;
                    res.locals.admin = true;
                }
                return res.render('Home');
            } else {
                return res.redirect('/');
            }
        } catch (err) {
            console.log(err);
            return res.redirect('/');
        }
    },

    // Create
    async getCreate(req, res) {
        res.render('Usuario/UsuarioCreate'); //////// Verificar isso
    },

    async postCreate(req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);
            await db.Usuario.create({
                ...req.body,
                senha: hashedPassword
            });
            res.redirect('/Home');
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            res.status(500).send('Erro ao criar usuário');
        }
    },

    // List
    async getList(req, res) {
        db.Usuario.findAll().then(usuario => {
            res.render('Usuario/UsuarioList', { usuario: usuario.map(user => user.toJSON()) });
        }).catch((err) => { console.log(err); });
    },

    //Update
    async getUpdate(req, res) {
        await db.Usuario.findByPk(req.params.id).then(
            usuario => res.render('Usuario/UsuarioUpdate', { usuario: usuario.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        await db.Usuario.update(req.body, { where: { id: req.body.id } }).then(
            () => res.render('Home')
        ).catch(function (err) { console.log(err); });
    },

    //Delete
    async getDelete(req, res) {
        await db.Usuario.destroy({ where: { id: req.params.id } }).then(
            () => res.render('Home')
        ).catch(err => { console.log(err); });
    }
}