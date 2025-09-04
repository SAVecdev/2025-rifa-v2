const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

console.log('🏗️  Cargando rutas de VENDEDOR...');

// Dashboard de vendedor
router.get('/dashboard', requireAuth, (req, res) => {
    res.render('pages/vendedor/dashboard', {
        title: 'Panel de Ventas - Rifas',
        pageTitle: 'Panel de Ventas',
        page: 'vendedor-dashboard',
        layout: 'layout/general'
    });
});

// Ver rifas disponibles para vender
router.get('/rifas', requireAuth, (req, res) => {
    res.render('pages/vendedor/rifas', {
        title: 'Rifas Disponibles - Rifas',
        pageTitle: 'Rifas Disponibles',
        page: 'vendedor-rifas',
        layout: 'layout/general'
    });
});

// Obtener rifas activas (API)
router.get('/api/rifas', requireAuth, async (req, res) => {
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
                disponibles: 35,
                estado: 'activa',
                fecha_fin: '2025-09-30',
                imagen: 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=iPhone+15+Pro',
                comision: 2.5 // Comisión por boleto vendido
            },
            {
                id: 2,
                titulo: 'PlayStation 5',
                descripcion: 'PlayStation 5 nueva generación',
                precio_boleto: 20,
                total_boletos: 150,
                vendidos: 120,
                disponibles: 30,
                estado: 'activa',
                fecha_fin: '2025-09-15',
                imagen: 'https://via.placeholder.com/400x250/1e293b/60a5fa?text=PlayStation+5',
                comision: 2.0
            }
        ];
        
        res.json({ success: true, data: rifas });
    } catch (error) {
        console.error('Error obteniendo rifas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Vender boleto (API)
router.post('/api/vender-boleto', requireAuth, async (req, res) => {
    try {
        const { rifa_id, cliente_nombre, cliente_telefono, cliente_email, cantidad } = req.body;
        
        // Validar datos
        if (!rifa_id || !cliente_nombre || !cliente_telefono || !cantidad) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }
        
        if (cantidad < 1) {
            return res.status(400).json({ success: false, message: 'La cantidad debe ser mayor a 0' });
        }
        
        // Aquí iría la lógica para procesar la venta
        const venta = {
            id: Date.now(),
            rifa_id: parseInt(rifa_id),
            vendedor_id: req.session.user.id,
            cliente_nombre,
            cliente_telefono,
            cliente_email: cliente_email || null,
            cantidad: parseInt(cantidad),
            total: cantidad * 25, // Esto vendría de la consulta de la rifa
            comision: cantidad * 2.5, // Comisión del vendedor
            boletos: generateTicketNumbers(cantidad), // Función para generar números
            fecha_venta: new Date().toISOString(),
            estado: 'pagado'
        };
        
        res.json({ 
            success: true, 
            data: venta, 
            message: `Venta realizada exitosamente. Boletos: ${venta.boletos.join(', ')}` 
        });
        
        // Emitir eventos de socket
        req.app.get('io').emit('vendedor:nueva-venta', { 
            venta, 
            vendedor: req.session.user.name 
        });
        req.app.get('io').emit('supervisor:nueva-venta', { venta });
        req.app.get('io').emit('admin:nueva-venta', { venta });
        
    } catch (error) {
        console.error('Error procesando venta:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Función auxiliar para generar números de boletos
function generateTicketNumbers(cantidad) {
    const boletos = [];
    for (let i = 0; i < cantidad; i++) {
        // En una implementación real, esto vendría de la base de datos
        boletos.push(Math.floor(Math.random() * 9999) + 1);
    }
    return boletos;
}

// Mis ventas
router.get('/mis-ventas', requireAuth, (req, res) => {
    res.render('pages/vendedor/mis-ventas', {
        title: 'Mis Ventas - Rifas',
        pageTitle: 'Mis Ventas',
        page: 'vendedor-mis-ventas',
        layout: 'layout/general'
    });
});

// API de mis ventas
router.get('/api/mis-ventas', requireAuth, async (req, res) => {
    try {
        const vendedor_id = req.session.user.id;
        
        // Aquí irían las consultas reales a la base de datos
        const ventas = [
            {
                id: 1,
                rifa_titulo: 'iPhone 15 Pro Max',
                cliente_nombre: 'Juan Pérez',
                cliente_telefono: '555-0123',
                cantidad: 3,
                total: 75,
                comision: 7.5,
                boletos: [1001, 1002, 1003],
                fecha_venta: '2025-09-03T10:30:00Z',
                estado: 'pagado'
            },
            {
                id: 2,
                rifa_titulo: 'PlayStation 5',
                cliente_nombre: 'María García',
                cliente_telefono: '555-0456',
                cantidad: 2,
                total: 40,
                comision: 4,
                boletos: [2055, 2056],
                fecha_venta: '2025-09-03T14:15:00Z',
                estado: 'pagado'
            }
        ];
        
        const resumen = {
            total_ventas: ventas.reduce((sum, venta) => sum + venta.total, 0),
            total_comisiones: ventas.reduce((sum, venta) => sum + venta.comision, 0),
            total_boletos: ventas.reduce((sum, venta) => sum + venta.cantidad, 0),
            ventas_hoy: ventas.filter(v => new Date(v.fecha_venta).toDateString() === new Date().toDateString()).length
        };
        
        res.json({ success: true, data: { ventas, resumen } });
    } catch (error) {
        console.error('Error obteniendo mis ventas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Comisiones
router.get('/comisiones', requireAuth, (req, res) => {
    res.render('pages/vendedor/comisiones', {
        title: 'Mis Comisiones - Rifas',
        pageTitle: 'Mis Comisiones',
        page: 'vendedor-comisiones',
        layout: 'layout/general'
    });
});

// API de comisiones
router.get('/api/comisiones', requireAuth, async (req, res) => {
    try {
        const vendedor_id = req.session.user.id;
        
        // Aquí irían las consultas reales a la base de datos
        const comisiones = {
            hoy: 15.50,
            semana: 125.75,
            mes: 567.25,
            total: 2340.80,
            pendientes: 45.25,
            pagadas: 2295.55,
            detalle: [
                {
                    fecha: '2025-09-03',
                    rifas: 3,
                    boletos: 8,
                    comision: 15.50,
                    estado: 'pendiente'
                },
                {
                    fecha: '2025-09-02',
                    rifas: 2,
                    boletos: 12,
                    comision: 25.75,
                    estado: 'pagada'
                }
            ]
        };
        
        res.json({ success: true, data: comisiones });
    } catch (error) {
        console.error('Error obteniendo comisiones:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Perfil y configuración
router.get('/perfil', requireAuth, (req, res) => {
    res.render('pages/vendedor/perfil', {
        title: 'Mi Perfil - Rifas',
        pageTitle: 'Mi Perfil',
        page: 'vendedor-perfil',
        layout: 'layout/general'
    });
});

// Actualizar perfil (API)
router.put('/api/perfil', requireAuth, async (req, res) => {
    try {
        const { name, telefono, direccion } = req.body;
        const userId = req.session.user.id;
        
        // Aquí iría la lógica para actualizar el perfil en la base de datos
        const User = require('../models/User');
        const updatedUser = await User.update(userId, { name });
        
        // Actualizar sesión
        req.session.user.name = name;
        
        res.json({ success: true, message: 'Perfil actualizado exitosamente' });
        
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;
