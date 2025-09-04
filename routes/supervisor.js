const express = require('express');
const router = express.Router();
const { requireAuth, requireSupervisor } = require('../middleware/auth');

console.log('🏗️  Cargando rutas de SUPERVISOR...');

// Dashboard de supervisor
router.get('/dashboard', requireAuth, requireSupervisor, (req, res) => {
    res.render('pages/supervisor/dashboard', {
        title: 'Panel de Supervisión - Rifas',
        pageTitle: 'Panel de Supervisión',
        page: 'supervisor-dashboard',
        layout: 'layout/general'
    });
});

// Gestión de rifas
router.get('/rifas', requireAuth, requireSupervisor, (req, res) => {
    res.render('pages/supervisor/rifas', {
        title: 'Gestión de Rifas - Rifas',
        pageTitle: 'Gestión de Rifas',
        page: 'supervisor-rifas',
        layout: 'layout/general'
    });
});

// Obtener rifas (API)
router.get('/api/rifas', requireAuth, requireSupervisor, async (req, res) => {
    try {
        // Aquí irían las consultas reales a la base de datos
        const rifas = [
            {
                id: 1,
                titulo: 'iPhone 15 Pro Max',
                descripcion: 'Nuevo iPhone 15 Pro Max 256GB',
                precio_boleto: 25,
                total_boletos: 100,
                vendidos: 65,
                estado: 'activa',
                fecha_inicio: '2025-09-01',
                fecha_fin: '2025-09-30',
                imagen: 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=iPhone+15+Pro'
            },
            {
                id: 2,
                titulo: 'PlayStation 5',
                descripcion: 'PlayStation 5 nueva generación',
                precio_boleto: 20,
                total_boletos: 150,
                vendidos: 120,
                estado: 'activa',
                fecha_inicio: '2025-08-15',
                fecha_fin: '2025-09-15',
                imagen: 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=PlayStation+5'
            }
        ];
        
        res.json({ success: true, data: rifas });
    } catch (error) {
        console.error('Error obteniendo rifas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Crear nueva rifa (API)
router.post('/api/rifas', requireAuth, requireSupervisor, async (req, res) => {
    try {
        const { titulo, descripcion, precio_boleto, total_boletos, fecha_fin, imagen } = req.body;
        
        // Validar datos
        if (!titulo || !descripcion || !precio_boleto || !total_boletos || !fecha_fin) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }
        
        // Aquí iría la lógica para crear la rifa en la base de datos
        const nuevaRifa = {
            id: Date.now(),
            titulo,
            descripcion,
            precio_boleto: parseFloat(precio_boleto),
            total_boletos: parseInt(total_boletos),
            vendidos: 0,
            estado: 'activa',
            fecha_inicio: new Date().toISOString().split('T')[0],
            fecha_fin,
            imagen: imagen || 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=' + encodeURIComponent(titulo),
            creador_id: req.session.user.id
        };
        
        res.json({ success: true, data: nuevaRifa, message: 'Rifa creada exitosamente' });
        
        // Emitir evento de socket para notificar nueva rifa
        req.app.get('io').emit('supervisor:nueva-rifa', { rifa: nuevaRifa });
        req.app.get('io').emit('general:nueva-rifa', { rifa: nuevaRifa });
        
    } catch (error) {
        console.error('Error creando rifa:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Actualizar rifa (API)
router.put('/api/rifas/:id', requireAuth, requireSupervisor, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Aquí iría la lógica para actualizar en la base de datos
        const rifaActualizada = {
            id: parseInt(id),
            ...updateData,
            updated_at: new Date().toISOString()
        };
        
        res.json({ success: true, data: rifaActualizada, message: 'Rifa actualizada exitosamente' });
        
        // Emitir evento de socket
        req.app.get('io').emit('supervisor:rifa-actualizada', { rifa: rifaActualizada });
        
    } catch (error) {
        console.error('Error actualizando rifa:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Finalizar rifa (API)
router.post('/api/rifas/:id/finalizar', requireAuth, requireSupervisor, async (req, res) => {
    try {
        const { id } = req.params;
        const { ganador_boleto } = req.body;
        
        if (!ganador_boleto) {
            return res.status(400).json({ success: false, message: 'Debe especificar el boleto ganador' });
        }
        
        // Aquí iría la lógica para finalizar la rifa
        const rifaFinalizada = {
            id: parseInt(id),
            estado: 'finalizada',
            ganador_boleto,
            fecha_finalizacion: new Date().toISOString()
        };
        
        res.json({ success: true, data: rifaFinalizada, message: 'Rifa finalizada exitosamente' });
        
        // Emitir evento de socket
        req.app.get('io').emit('supervisor:rifa-finalizada', { rifa: rifaFinalizada });
        req.app.get('io').emit('general:rifa-finalizada', { rifa: rifaFinalizada });
        
    } catch (error) {
        console.error('Error finalizando rifa:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ventas y reportes
router.get('/ventas', requireAuth, requireSupervisor, (req, res) => {
    res.render('pages/supervisor/ventas', {
        title: 'Ventas - Rifas',
        pageTitle: 'Control de Ventas',
        page: 'supervisor-ventas',
        layout: 'layout/general'
    });
});

// API de ventas
router.get('/api/ventas', requireAuth, requireSupervisor, async (req, res) => {
    try {
        // Aquí irían las consultas reales a la base de datos
        const ventas = {
            hoy: {
                total: 2340,
                boletos: 94,
                rifas: 8
            },
            semana: {
                total: 15640,
                boletos: 625,
                rifas: 12
            },
            mes: {
                total: 45600,
                boletos: 1824,
                rifas: 24
            },
            vendedores: [
                { nombre: 'Juan Pérez', ventas: 450, boletos: 18 },
                { nombre: 'María García', ventas: 380, boletos: 15 },
                { nombre: 'Carlos López', ventas: 320, boletos: 13 }
            ]
        };
        
        res.json({ success: true, data: ventas });
    } catch (error) {
        console.error('Error obteniendo ventas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Gestión de vendedores
router.get('/vendedores', requireAuth, requireSupervisor, (req, res) => {
    res.render('pages/supervisor/vendedores', {
        title: 'Vendedores - Rifas',
        pageTitle: 'Gestión de Vendedores',
        page: 'supervisor-vendedores',
        layout: 'layout/general'
    });
});

// API de vendedores
router.get('/api/vendedores', requireAuth, requireSupervisor, async (req, res) => {
    try {
        const User = require('../models/User');
        const vendedores = await User.findByRole('vendedor');
        res.json({ success: true, data: vendedores });
    } catch (error) {
        console.error('Error obteniendo vendedores:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
