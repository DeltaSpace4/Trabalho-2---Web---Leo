const db = require('../Config/Db');

module.exports = {
    logRegister(req, res, next) {
        console.log(req.url + req.method + new Date())
        next();
    },
    sessionControl(req, res, next) {
        console.log('Session middleware - URL:', req.url, 'Method:', req.method);
        console.log('Session data:', req.session);

        // Public routes that don't need authentication
        const publicRoutes = ['/', '/login', '/criarUsuario'];
        if (publicRoutes.includes(req.url) || req.url.startsWith('/css/') || req.url.startsWith('/images/')) {
            return next();
        }

        // Check if user is logged in
        if (req.session.email) {
            // Set locals for use in templates
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

        // Not logged in and trying to access protected route
        console.log('Unauthorized access attempt, redirecting to login');
        res.redirect('/');
    },

    // Check if user can edit a project (is admin or linked via UsuarioProjeto)
    async checkUserProjectAccess(req, res, next) {
        try {
            // admins can edit all projects
            if (req.session.tipo === 'admin') {
                return next();
            }

            // get projetoId from params, body or query
            const projetoId = req.params.id || req.body.id || req.query.projetoId;
            if (!projetoId) {
                console.log('No projeto id found in request');
                return res.redirect('/home');
            }

            // Check if the user has access via UsuarioProjeto
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

            // user is linked to project through UsuarioProjeto, allow access with admin privileges
            next();
        } catch (err) {
            console.error('Error checking project access:', err);
            res.redirect('/home');
        }
    }
};