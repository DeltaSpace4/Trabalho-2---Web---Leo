const db = require('../Config/Db');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db_mongoose = require('../Config/Db_mongoose'); 
const Usuario = require('../Models/NoSql/LogUsuario');

module.exports = {

    // Login
    async getLogin(req, res) {
        res.render('usuario/login', { layout: 'NoMenu.handlebars' });
    },
    async getLogout(req, res) {
        //res.cookie("userData", req.cookies.userData, { maxAge: 0, httpOnly: true });
        req.session.destroy();
        res.redirect('/');
    },

    async postLogin(req, res) {
        try {
            console.log('Tentativa de Login:', req.body);

            if (!req.body.email || !req.body.senha) {
                return res.render('usuario/login', {
                    error: 'Por favor, preencha todos os campos',
                    layout: 'NoMenu'
                });
            }

            const user = await db.Usuario.findOne({ where: { email: req.body.email } });
            console.log('Achou Usuario:', user ? 'Yes' : 'No');

            if (!user) {
                return res.render('usuario/login', {
                    error: 'Usuário não encontrado',
                    layout: 'NoMenu'
                });
            }

            const passwordMatch = await bcrypt.compare(req.body.senha, user.senha);
            console.log('Password match:', passwordMatch ? 'Yes' : 'No');

            if (!passwordMatch) {
                return res.render('usuario/login', {
                    error: 'Senha incorreta',
                    layout: 'NoMenu'
                });
            }

            req.session.email = user.email;
            req.session.userId = user.id;
            req.session.nome = user.nome;
            res.locals.email = user.email;
            res.locals.nome = user.nome;
            
            if (user.tipo === 'admin') {
                req.session.tipo = 'admin';
                res.locals.admin = true;
            }

            if (user.tipo === 'aluno') {
                req.session.tipo = 'aluno';
                res.locals.aluno = true;
            }

            console.log('Login successful, session:', req.session);
            return res.redirect('/home');
        } catch (err) {
            console.error('Login error:', err);
            return res.render('usuario/login', {
                error: 'Erro ao fazer login. Tente novamente.',
                layout: 'NoMenu'
            });
        }
    },

    // Create
    async getCreate(req, res) {
        res.render('usuario/criarUsuario', {
            layout: 'NoMenu'
        });
    },

    async postCreate(req, res) {
        try {
            if (!req.body.nome || !req.body.email || !req.body.senha) {
                return res.render('usuario/criarUsuario', {
                    error: 'Por favor, preencha todos os campos',
                    layout: 'NoMenu'
                });
            }

            const existingUser = await db.Usuario.findOne({ 
                where: { email: req.body.email } 
            });
            
            if (existingUser) {
                return res.render('usuario/criarUsuario', {
                    error: 'Este email já está cadastrado',
                    layout: 'NoMenu'
                });
            }

            const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);
            const user = await db.Usuario.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: hashedPassword,
                tipo: req.body.tipo || 'aluno',
                ativo: true
            });

            req.session.email = user.email;
            req.session.userId = user.id;
            res.locals.email = user.email;
            
            if (user.tipo === 'admin') {
                req.session.tipo = 'admin';
                res.locals.admin = true;
            }

            if (user.tipo === 'aluno') {
                req.session.tipo = 'aluno';
                res.locals.aluno = true;
            }
            await LogUsuario.logarUsuario('Usuário "${req.body.nome}" Criado', req.session.userId, req.session.email);
            return res.redirect('/home');
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            return res.render('usuario/criarUsuario', {
                error: 'Erro ao criar usuário. Por favor, tente novamente.',
                layout: 'NoMenu.handlebars'
            });
        }
    },

    // List
    async getList(req, res) {
        db.Usuario.findAll().then(usuario => {
            res.render('usuario/listarUsuario', { usuario: usuario.map(user => user.toJSON()) });
        }).catch((err) => { console.log(err); });
    },

    //Update
    async getUpdate(req, res) {
        await db.Usuario.findByPk(req.params.id).then(
            usuario => res.render('usuario/atualizarUsuario', { usuario: usuario.dataValues })
        ).catch(function (err) { console.log(err); });
    },
    async postUpdate(req, res) {
        try {
            const updateData = { ...req.body };
            delete updateData.id; 
            
            // hash de senha
            if (updateData.senha) {
                updateData.senha = await bcrypt.hash(updateData.senha, saltRounds);
            } else {
                delete updateData.senha; 
            }

            const [updated] = await db.Usuario.update(updateData, { 
                where: { id: req.body.id }
            });

            if (updated) {
                return res.redirect('/listarUsuario');
            } else {
                return res.render('usuario/atualizarUsuario', {
                    error: 'Usuário não encontrado',
                    usuario: updateData
                });
            }
        } catch (err) {
            console.error('Update error:', err);
            return res.render('usuario/atualizarUsuario', {
                error: 'Erro ao atualizar usuário',
                usuario: req.body
            });
        }
    },

    //Delete
    async getDelete(req, res) {
        await db.Usuario.destroy({ where: { id: req.params.id } }).then(
            () => res.redirect('/listarUsuario')
        ).catch(err => { console.log(err); });
    }
}