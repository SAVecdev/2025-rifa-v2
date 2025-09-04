// Middleware para verificar si el usuario está autenticado
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', 'Debes iniciar sesión para acceder a esta página');
        res.redirect('/login');
    }
};

// Middleware para verificar si el usuario es administrador
const requireAdmin = (req, res, next) => {
    console.log('🔒 requireAdmin - Usuario en sesión:', req.session.user ? req.session.user.role : 'No autenticado');
    if (req.session.user && req.session.user.role === 'administrador') {
        console.log('✅ Acceso de administrador permitido');
        next();
    } else {
        console.log('❌ Acceso de administrador denegado - Redirigiendo a /');
        req.flash('error', 'No tienes permisos para acceder a esta página');
        res.redirect('/');
    }
};

// Middleware para verificar si el usuario es supervisor o administrador
const requireSupervisor = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'administrador' || req.session.user.role === 'supervisor')) {
        next();
    } else {
        req.flash('error', 'No tienes permisos para acceder a esta página');
        res.redirect('/');
    }
};

// Middleware para verificar si el usuario NO está autenticado
const requireGuest = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        res.redirect('/profile');
    }
};

module.exports = {
    requireAuth,
    requireAdmin,
    requireSupervisor,
    requireGuest
};
