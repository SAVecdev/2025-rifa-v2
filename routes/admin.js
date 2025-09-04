const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

console.log('🏗️  Cargando rutas de ADMIN...');

// Dashboard de administrador
router.get('/', requireAuth, requireAdmin, (req, res) => {
    console.log('🎯 Renderizando dashboard de admin para:', req.session.user.name);
    res.render('pages/admin/dashboard', {
        title: 'Panel de Administración - Rifas',
        pageTitle: 'Panel de Administración',
        page: 'admin-dashboard',
        layout: 'layout/general'
    });
});

// También agregar una ruta específica para /dashboard
router.get('/dashboard', requireAuth, requireAdmin, (req, res) => {
    console.log('🎯 Renderizando dashboard de admin (ruta /dashboard) para:', req.session.user.name);
    res.render('pages/admin/dashboard', {
        title: 'Panel de Administración - Rifas',
        pageTitle: 'Panel de Administración',
        page: 'admin-dashboard',
        layout: 'layout/general'
    });
});

// Gestión de usuarios
router.get('/usuarios', requireAuth, requireAdmin, (req, res) => {
    res.render('pages/admin/usuarios', {
        title: 'Gestión de Usuarios - Rifas',
        pageTitle: 'Gestión de Usuarios',
        page: 'admin-usuarios',
        layout: 'layout/general'
    });
});

// Obtener lista de usuarios (API)
router.get('/api/usuarios', requireAuth, requireAdmin, async (req, res) => {
    try {
        const User = require('../models/User');
        const usuarios = await User.getAllUsers();
        res.json({ success: true, data: usuarios });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Crear usuario (API)
router.post('/api/usuarios', requireAuth, requireAdmin, async (req, res) => {
    try {
        const User = require('../models/User');
        const { name, email, password, role, branchId } = req.body;
        
        // Validar datos
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }
        
        // Verificar si el email ya existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado' });
        }
        
        // Crear usuario
        const newUser = await User.create({ name, email, password, role, branchId });
        
        res.json({ success: true, data: newUser, message: 'Usuario creado exitosamente' });
        
        // Emitir evento de socket para notificar cambios
        req.app.get('io').emit('admin:usuario-creado', { user: newUser });
        
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Actualizar usuario (API)
router.put('/api/usuarios/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const User = require('../models/User');
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedUser = await User.update(id, updateData);
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        
        res.json({ success: true, data: updatedUser, message: 'Usuario actualizado exitosamente' });
        
        // Emitir evento de socket
        req.app.get('io').emit('admin:usuario-actualizado', { user: updatedUser });
        
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Desactivar usuario (API)
router.delete('/api/usuarios/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const User = require('../models/User');
        const { id } = req.params;
        
        await User.deactivate(id);
        
        res.json({ success: true, message: 'Usuario desactivado exitosamente' });
        
        // Emitir evento de socket
        req.app.get('io').emit('admin:usuario-desactivado', { userId: id });
        
    } catch (error) {
        console.error('Error desactivando usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Reportes generales
router.get('/reportes', requireAuth, requireAdmin, (req, res) => {
    res.render('pages/admin/reportes', {
        title: 'Reportes - Rifas',
        pageTitle: 'Reportes y Estadísticas',
        page: 'admin-reportes',
        layout: 'layout/general'
    });
});

// API de estadísticas generales
router.get('/api/estadisticas', requireAuth, requireAdmin, async (req, res) => {
    try {
        // Aquí irían las consultas reales a la base de datos
        const estadisticas = {
            usuarios: {
                total: 1567,
                activos: 1234,
                nuevosHoy: 12,
                nuevosEsteMes: 234
            },
            rifas: {
                total: 45,
                activas: 24,
                finalizadas: 21,
                ventasHoy: 2340
            },
            ventas: {
                totalVentas: 125000,
                ventasHoy: 2340,
                ventasMes: 45600,
                comisiones: 12500
            }
        };
        
        res.json({ success: true, data: estadisticas });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// API de estadísticas semanales para el chart
router.get('/api/estadisticas-semanales', requireAuth, requireAdmin, async (req, res) => {
    try {
        const EstadisticaModel = require('../models/Estaditicas');
        const estadisticasSemanales = await EstadisticaModel.semanales();
        
        // Formatear los datos para Chart.js
        const labels = [];
        const data = [];
        
        estadisticasSemanales.forEach(stat => {
            // Formatear la fecha para mostrar
            const fecha = new Date(stat.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
                month: 'short', 
                day: 'numeric' 
            });
            labels.push(fechaFormateada);
            data.push(parseFloat(stat.total) || 0);
        });
        
        res.json({ 
            success: true, 
            data: {
                labels: labels,
                valores: data
            }
        });
        
        console.log('📊 Estadísticas semanales enviadas:', { labels: labels.length, valores: data.length });
        
    } catch (error) {
        console.error('Error obteniendo estadísticas semanales:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Configuración del sistema
router.get('/configuracion', requireAuth, requireAdmin, (req, res) => {
    res.render('pages/admin/configuracion', {
        title: 'Configuración - Rifas',
        pageTitle: 'Configuración del Sistema',
        page: 'admin-configuracion',
        layout: 'layout/general'
    });
});

module.exports = router;
