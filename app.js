const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flashMiddleware = require('./middleware/flash');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection } = require('./config/database');

// Importar Socket Manager
const SocketManager = require('./socket/socketManager');

// Importar rutas
const routes = require('./routes');
const adminRoutes = require('./routes/admin');
const supervisorRoutes = require('./routes/supervisor');
const vendedorRoutes = require('./routes/vendedor');

// Importar middleware de redirección por rol
const { redirectByRole, checkDashboardAccess } = require('./middleware/roleRedirect');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout/main'); // Layout por defecto
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src'))); // Mantener src para compatibilidad

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
    secret: 'rifas-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Configurar flash messages (middleware personalizado)
app.use(flashMiddleware);

// Configurar Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// Inicializar Socket Manager
const socketManager = new SocketManager(io);
socketManager.initialize();

app.set('io', io);
app.set('socketManager', socketManager);

// Middleware global para pasar datos a todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    // Los mensajes flash ya se configuran en el middleware personalizado
    next();
});

// Middleware para logging (opcional)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log(`🔍 Procesando ruta: ${req.url} - Usuario autenticado: ${req.session.user ? req.session.user.role : 'No'}`);
    next();
});

// Usar las rutas específicas primero
console.log('🔧 Registrando rutas de admin...');
app.use('/admin', adminRoutes);
console.log('🔧 Registrando rutas de supervisor...');
app.use('/supervisor', supervisorRoutes);
console.log('🔧 Registrando rutas de vendedor...');
app.use('/vendedor', vendedorRoutes);

// Middleware de redirección por rol (solo para rutas generales)
app.use(redirectByRole);
app.use(checkDashboardAccess);

// Rutas generales al final
console.log('🔧 Registrando rutas generales...');
app.use('/', routes);

// Middleware para manejar errores 404
app.use((req, res, next) => {
    console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).render('pages/404', {
        title: 'Página no encontrada - Rifas',
        page: '404',
        layout: 'layout/main',
        url: req.url
    });
});

// Middleware para manejar errores del servidor
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err);
    res.status(500).render('pages/404', {
        title: 'Error del servidor - Rifas',
        page: 'error',
        layout: 'layout/main',
        error: err.message
    });
});

// Iniciar servidor
server.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Socket.IO habilitado');
    
    // Probar conexión a la base de datos
    await testConnection();
});

module.exports = { app, server, io };
