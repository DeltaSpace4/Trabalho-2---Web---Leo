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
    }
};