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
            console.log('Login attempt:', req.body);

            if (!req.body.email || !req.body.senha) {
                return res.render('Usuario/Login', {
                    error: 'Por favor, preencha todos os campos',
                    layout: 'NoMenu'
                });
            }

            const user = await db.Usuario.findOne({ where: { email: req.body.email } });
            console.log('User found:', user ? 'Yes' : 'No');

            if (!user) {
                return res.render('Usuario/Login', {
                    error: 'Usuário não encontrado',
                    layout: 'NoMenu'
                });
            }

            const passwordMatch = await bcrypt.compare(req.body.senha, user.senha);
            console.log('Password match:', passwordMatch ? 'Yes' : 'No');

            if (!passwordMatch) {
                return res.render('Usuario/Login', {
                    error: 'Senha incorreta',
                    layout: 'NoMenu'
                });
            }

            // Login successful
            req.session.email = user.email;
            req.session.userId = user.id;
            req.session.nome = user.nome;
            res.locals.email = user.email;
            res.locals.nome = user.nome;
            
            if (user.tipo === 'admin') {
                req.session.tipo = 'admin';
                res.locals.admin = true;
            }

            console.log('Login successful, session:', req.session);
            return res.redirect('/Home');
        } catch (err) {
            console.error('Login error:', err);
            return res.render('Usuario/Login', {
                error: 'Erro ao fazer login. Tente novamente.',
                layout: 'NoMenu'
            });
        }
    },

    // Create
    async getCreate(req, res) {
        res.render('Usuario/UsuarioCreate', { 
            layout: 'NoMenu.handlebars' 
        });
    },

    async postCreate(req, res) {
        try {
            // Validate required fields
            if (!req.body.nome || !req.body.email || !req.body.senha) {
                return res.render('Usuario/UsuarioCreate', {
                    error: 'Por favor, preencha todos os campos',
                    layout: 'NoMenu.handlebars'
                });
            }

            // Check if email already exists
            const existingUser = await db.Usuario.findOne({ 
                where: { email: req.body.email } 
            });
            
            if (existingUser) {
                return res.render('Usuario/UsuarioCreate', {
                    error: 'Este email já está cadastrado',
                    layout: 'NoMenu.handlebars'
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

            // Log the user in automatically
            req.session.email = user.email;
            req.session.userId = user.id;
            res.locals.email = user.email;
            
            if (user.tipo === 'admin') {
                req.session.tipo = 'admin';
                res.locals.admin = true;
            }

            return res.redirect('/Home');
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            return res.render('Usuario/UsuarioCreate', {
                error: 'Erro ao criar usuário. Por favor, tente novamente.',
                layout: 'NoMenu.handlebars'
            });
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
        try {
            const updateData = { ...req.body };
            delete updateData.id; // Remove ID from update data
            
            // If password is being updated, hash it
            if (updateData.senha) {
                updateData.senha = await bcrypt.hash(updateData.senha, saltRounds);
            } else {
                delete updateData.senha; // Don't update password if not provided
            }

            const [updated] = await db.Usuario.update(updateData, { 
                where: { id: req.body.id }
            });

            if (updated) {
                return res.redirect('/ListarUsuario');
            } else {
                return res.render('Usuario/UsuarioUpdate', {
                    error: 'Usuário não encontrado',
                    usuario: updateData
                });
            }
        } catch (err) {
            console.error('Update error:', err);
            return res.render('Usuario/UsuarioUpdate', {
                error: 'Erro ao atualizar usuário',
                usuario: req.body
            });
        }
    },

    //Delete
    async getDelete(req, res) {
        await db.Usuario.destroy({ where: { id: req.params.id } }).then(
            () => res.render('Home')
        ).catch(err => { console.log(err); });
    }
}