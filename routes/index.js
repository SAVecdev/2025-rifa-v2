const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireAdmin, requireSupervisor, requireGuest } = require('../middleware/auth');

// Ruta principal - Página de inicio
router.get('/', (req, res) => {
    if (req.session.user) {
        // Si el usuario está logueado, redirigir según su rol
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
    
    res.render('pages/home', {
        title: 'Inicio - Rifas',
        page: 'home',
        layout: 'layout/main'
    });
});

// Página Acerca de
router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'Acerca de - Rifas',
        page: 'about',
        layout: 'layout/main'
    });
});

// Página de contacto
router.get('/contact', (req, res) => {
    res.render('pages/contact', {
        title: 'Contacto - Rifas',
        page: 'contact',
        layout: 'layout/main'
    });
});

// Página de rifas (nueva ruta)
router.get('/rifas', (req, res) => {
    res.render('pages/rifas', {
        title: 'Rifas Activas - Rifas',
        page: 'rifas',
        layout: 'layout/main'
    });
});

// Página de perfil (nueva ruta) - requiere autenticación
router.get('/profile', requireAuth, (req, res) => {
    res.render('pages/profile', {
        title: 'Mi Perfil - Rifas',
        page: 'profile',
        layout: 'layout/main'
    });
});

// Ruta para manejar el envío del formulario de contacto
router.post('/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Aquí puedes agregar la lógica para procesar el formulario
    // Por ejemplo: enviar email, guardar en base de datos, etc.
    
    console.log('Formulario de contacto recibido:', {
        name,
        email,
        subject,
        message
    });
    
    res.json({
        success: true,
        message: 'Mensaje enviado correctamente'
    });
});

// Ruta API para obtener rifas activas
router.get('/api/rifas', (req, res) => {
    // Datos de ejemplo - en una aplicación real vendría de una base de datos
    const rifas = [
        {
            id: 1,
            title: 'iPhone 15 Pro Max',
            price: 50,
            image: 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=iPhone+15+Pro',
            progress: 65,
            badge: '¡Nuevo!'
        },
        {
            id: 2,
            title: 'MacBook Pro M3',
            price: 75,
            image: 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=MacBook+Pro',
            progress: 40
        },
        {
            id: 3,
            title: 'PlayStation 5',
            price: 30,
            image: 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=PlayStation+5',
            progress: 80
        }
    ];
    
    res.json(rifas);
});

// Ruta para comprar boletos
router.post('/api/comprar-boleto', (req, res) => {
    const { rifaId, numerosBoletos } = req.body;
    
    // Lógica para procesar la compra
    console.log('Compra de boleto:', { rifaId, numerosBoletos });
    
    res.json({
        success: true,
        message: 'Boleto comprado exitosamente',
        transactionId: Date.now()
    });
});

// Dashboard general (para usuarios que no tienen rol específico)
router.get('/dashboard', requireAuth, (req, res) => {
    const role = req.session.user.role;
    
    // Redirigir a dashboard específico según el rol
    switch (role) {
        case 'administrador':
            return res.redirect('/admin/dashboard');
        case 'supervisor':
            return res.redirect('/supervisor/dashboard');
        case 'vendedor':
            return res.redirect('/vendedor/dashboard');
        default:
            // Dashboard genérico para otros roles
            res.render('pages/dashboard', {
                title: 'Dashboard - Rifas',
                pageTitle: 'Dashboard',
                page: 'dashboard',
                layout: 'layout/general'
            });
    }
});

// Ruta de administración (ejemplo) - requiere rol admin
router.get('/admin', requireAuth, requireAdmin, (req, res) => {
    res.render('pages/admin-dashboard', {
        title: 'Panel de Administración - Rifas',
        page: 'admin',
        layout: 'layout/admin'
    });
});

// Ruta de login (ejemplo) - solo para invitados
router.get('/login', requireGuest, (req, res) => {
    res.render('pages/login', {
        title: 'Iniciar Sesión - Rifas',
        page: 'login',
        layout: 'layout/auth'
    });
});

// Procesar login
router.post('/login', requireGuest, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar datos
        if (!email || !password) {
            req.flash('error', 'Todos los campos son obligatorios');
            return res.redirect('/login');
        }

        // Buscar usuario
        const user = await User.findByEmail(email);
        if (!user) {
            req.flash('error', 'Credenciales incorrectas');
            return res.redirect('/login');
        }

        // Validar contraseña
        const isValidPassword = await User.validatePassword(password, user.password);
        if (!isValidPassword) {
            req.flash('error', 'Credenciales incorrectas');
            return res.redirect('/login');
        }

        // Crear sesión
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            status: user.status,
            branchId: user.branchId,
            branchResponsibleId: user.branchResponsibleId,
            config: user.config ? (typeof user.config === 'string' ? JSON.parse(user.config) : user.config) : null
        };

        req.flash('success', `¡Bienvenido ${user.name}!`);
        
        // Redirigir según el rol
        if (user.role === 'administrador') {
            res.redirect('/admin/dashboard');
        } else if (user.role === 'supervisor') {
            res.redirect('/supervisor/dashboard');
        } else if (user.role === 'vendedor') {
            res.redirect('/vendedor/dashboard');
        } else {
            res.redirect('/dashboard');
        }

    } catch (error) {
        console.error('Error en login:', error);
        req.flash('error', 'Error interno del servidor');
        res.redirect('/login');
    }
});

// Ruta de registro
router.get('/register', requireGuest, (req, res) => {
    res.render('pages/register', {
        title: 'Registrarse - Rifas',
        page: 'register',
        layout: 'layout/auth'
    });
});

// Procesar registro
router.post('/register', requireGuest, async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validar datos
        if (!name || !email || !password || !confirmPassword) {
            req.flash('error', 'Todos los campos son obligatorios');
            return res.redirect('/register');
        }

        if (password !== confirmPassword) {
            req.flash('error', 'Las contraseñas no coinciden');
            return res.redirect('/register');
        }

        if (password.length < 6) {
            req.flash('error', 'La contraseña debe tener al menos 6 caracteres');
            return res.redirect('/register');
        }

        // Verificar si el email ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            req.flash('error', 'Este correo electrónico ya está registrado');
            return res.redirect('/register');
        }

        // Crear usuario
        const newUser = await User.create({ name, email, password });

        // Crear sesión
        req.session.user = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            avatar: newUser.avatar,
            status: newUser.status,
            branchId: newUser.branchId,
            branchResponsibleId: newUser.branchResponsibleId,
            config: newUser.config ? (typeof newUser.config === 'string' ? JSON.parse(newUser.config) : newUser.config) : null
        };

        req.flash('success', `¡Bienvenido ${newUser.name}! Tu cuenta ha sido creada exitosamente.`);
        res.redirect('/profile');

    } catch (error) {
        console.error('Error en registro:', error);
        req.flash('error', 'Error interno del servidor');
        res.redirect('/register');
    }
});

// Cerrar sesión
router.post('/logout', requireAuth, (req, res) => {
    const userName = req.session.user.name;
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            req.flash('error', 'Error al cerrar sesión');
            return res.redirect('/profile');
        }
        res.clearCookie('connect.sid');
        res.redirect('/?message=¡Hasta luego ' + userName + '!');
    });
});

// Rutas de administración con sidebar
router.get('/admin/usuarios', requireAuth, requireAdmin, (req, res) => {
    res.render('pages/admin-usuarios', {
        title: 'Gestión de Usuarios - Rifas',
        pageTitle: 'Gestión de Usuarios',
        page: 'admin-usuarios',
        layout: 'layout/general'
    });
});

router.get('/admin/rifas', requireAuth, requireSupervisor, (req, res) => {
    res.render('pages/admin-rifas', {
        title: 'Gestión de Rifas - Rifas',
        pageTitle: 'Gestión de Rifas',
        page: 'admin-rifas',
        layout: 'layout/general'
    });
});

router.get('/mis-compras', requireAuth, (req, res) => {
    res.render('pages/mis-compras', {
        title: 'Mis Compras - Rifas',
        pageTitle: 'Mis Compras',
        page: 'mis-compras',
        layout: 'layout/general'
    });
});

// Ruta 404 - debe ir al final
router.use('*', (req, res) => {
    res.status(404).render('pages/404', {
        title: 'Página no encontrada - Rifas',
        page: '404',
        layout: 'layout/error'
    });
});

module.exports = router;
