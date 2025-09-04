// Middleware para redireccionar automáticamente según el rol del usuario
const redirectByRole = (req, res, next) => {
    // Solo aplicar si el usuario está autenticado y está en la ruta raíz
    if (req.session.user && req.path === '/') {
        const role = req.session.user.role;
        
        switch (role) {
            case 'administrador':
                return res.redirect('/admin/dashboard');
            case 'supervisor':
                return res.redirect('/supervisor/dashboard');
            case 'vendedor':
                return res.redirect('/vendedor/dashboard');
            default:
                return res.redirect('/dashboard');
        }
    }
    next();
};

// Middleware para verificar acceso a dashboard por rol
const checkDashboardAccess = (req, res, next) => {
    if (req.session.user && req.path === '/dashboard') {
        const role = req.session.user.role;
        
        // Si es admin, supervisor o vendedor, redirigir a su dashboard específico
        if (role === 'administrador') {
            return res.redirect('/admin/dashboard');
        } else if (role === 'supervisor') {
            return res.redirect('/supervisor/dashboard');
        } else if (role === 'vendedor') {
            return res.redirect('/vendedor/dashboard');
        }
    }
    next();
};

module.exports = {
    redirectByRole,
    checkDashboardAccess
};
