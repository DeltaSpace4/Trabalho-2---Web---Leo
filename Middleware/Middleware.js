const db = require('../Config/Db');

module.exports = {
    logRegister(req, res, next) {
        console.log(req.url + req.method + new Date())
        next();
    },
    sessionControl(req, res, next) {
        console.log('Session middleware - URL:', req.url, 'Method:', req.method);
        console.log('Session data:', req.session);

        // rotas públicas sem autenticação
        const publicRoutes = ['/', '/login', '/criarUsuario'];
        if (publicRoutes.includes(req.url) || req.url.startsWith('/css/') || req.url.startsWith('/images/')) {
            return next();
        }

        if (req.session.email) {
            res.locals.email = req.session.email;
            res.locals.nome = req.session.nome;
            if (req.session.tipo === 'admin') {
                res.locals.admin = true;
            }
            if (req.session.tipo === 'aluno') {
                res.locals.aluno = true;
            }
            return next();
        }

        console.log('Login não autorizado');
        res.redirect('/');
    },

    async checkUserProjectAccess(req, res, next) {
        try {
            // admins pode acessar tudo
            if (req.session.tipo === 'admin') {
                return next();
            }

            const projetoId = req.params.id || req.body.id || req.query.projetoId;
            if (!projetoId) {
                console.log('No projeto id found in request');
                return res.redirect('/home');
            }

            const usuarioProjeto = await db.UsuarioProjeto.findOne({
                where: {
                    usuarioId: req.session.userId,
                    projetoId: projetoId
                }
            });

            if (!usuarioProjeto) {
                console.log('User not linked to projeto:', projetoId);
                return res.redirect('/home');
            }

            // Se o usuário está vinculado ao projeto, dar permissões de admin temporariamente
            res.locals.admin = true;
            // Guarda o estado original do tipo de usuário
            const originalTipo = req.session.tipo;
            req.session.tipo = 'admin';

            // Após a requisição, restaurar o tipo original
            res.on('finish', () => {
                req.session.tipo = originalTipo;
                res.locals.admin = (originalTipo === 'admin');
            });

            next();
        } catch (err) {
            console.error('Error checking project access:', err);
            res.redirect('/home');
        }
    }
};