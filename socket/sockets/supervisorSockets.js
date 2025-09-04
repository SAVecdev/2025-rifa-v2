// Eventos de Socket.IO específicos para supervisores

const supervisorSockets = {
    setupEvents(socket, io) {
        console.log(`👨‍💼 Configurando eventos de supervisor para: ${socket.userName}`);

        // Evento: Obtener lista de vendedores en línea
        socket.on('obtenerVendedoresEnLinea', () => {
            try {
                // Obtener vendedores conectados
                const vendedoresConectados = [];
                io.sockets.adapter.rooms.get('vendedores')?.forEach(socketId => {
                    const vendedorSocket = io.sockets.sockets.get(socketId);
                    if (vendedorSocket && vendedorSocket.userRole === 'vendedor') {
                        vendedoresConectados.push({
                            id: vendedorSocket.userId,
                            nombre: vendedorSocket.userName,
                            email: vendedorSocket.userEmail,
                            estado: 'en_linea',
                            socketId: socketId,
                            conectadoDesde: new Date()
                        });
                    }
                });

                socket.emit('vendedoresEnLinea', vendedoresConectados);

            } catch (error) {
                console.error('Error al obtener vendedores en línea:', error);
                socket.emit('error', {
                    message: 'Error al obtener vendedores en línea',
                    error: error.message
                });
            }
        });

        // Evento: Monitorear ventas en tiempo real
        socket.on('iniciarMonitoreoVentas', () => {
            console.log(`📊 ${socket.userName} inició monitoreo de ventas`);
            
            // Unirse a sala de monitoreo
            socket.join('monitoreo_ventas');
            
            socket.emit('monitoreoIniciado', {
                message: 'Monitoreo de ventas activado',
                timestamp: new Date()
            });
        });

        // Evento: Detener monitoreo de ventas
        socket.on('detenerMonitoreoVentas', () => {
            console.log(`📊 ${socket.userName} detuvo monitoreo de ventas`);
            
            socket.leave('monitoreo_ventas');
            
            socket.emit('monitoreoDetenido', {
                message: 'Monitoreo de ventas desactivado',
                timestamp: new Date()
            });
        });

        // Evento: Responder a solicitud de ayuda de vendedor
        socket.on('responderSolicitudAyuda', (data) => {
            try {
                console.log(`🆘 ${socket.userName} responde solicitud de ayuda:`, data);
                
                const respuesta = {
                    solicitudId: data.solicitudId,
                    vendedorId: data.vendedorId,
                    supervisorId: socket.userId,
                    supervisorNombre: socket.userName,
                    respuesta: data.respuesta,
                    estado: 'atendida',
                    timestamp: new Date()
                };

                // Buscar al vendedor específico y enviarle la respuesta
                const vendedorRoom = io.sockets.adapter.rooms.get('vendedores');
                if (vendedorRoom) {
                    vendedorRoom.forEach(socketId => {
                        const vendedorSocket = io.sockets.sockets.get(socketId);
                        if (vendedorSocket && vendedorSocket.userId === data.vendedorId) {
                            vendedorSocket.emit('respuestaAyuda', respuesta);
                        }
                    });
                }

                // Confirmar al supervisor
                socket.emit('solicitudRespondida', {
                    success: true,
                    respuesta: respuesta,
                    message: 'Respuesta enviada al vendedor'
                });

                // Notificar a administradores
                socket.to('administradores').emit('solicitudAtendida', respuesta);

            } catch (error) {
                console.error('Error al responder solicitud:', error);
                socket.emit('error', {
                    message: 'Error al responder solicitud',
                    error: error.message
                });
            }
        });

        // Evento: Enviar mensaje a vendedor específico
        socket.on('enviarMensajeVendedor', (data) => {
            try {
                console.log(`💬 ${socket.userName} envía mensaje a vendedor:`, data);
                
                const mensaje = {
                    id: Date.now(),
                    de: socket.userName,
                    para: data.vendedorId,
                    mensaje: data.mensaje,
                    tipo: 'supervisor_mensaje',
                    timestamp: new Date()
                };

                // Buscar al vendedor y enviarle el mensaje
                const vendedorRoom = io.sockets.adapter.rooms.get('vendedores');
                if (vendedorRoom) {
                    vendedorRoom.forEach(socketId => {
                        const vendedorSocket = io.sockets.sockets.get(socketId);
                        if (vendedorSocket && vendedorSocket.userId === data.vendedorId) {
                            vendedorSocket.emit('mensajeSupervisor', mensaje);
                        }
                    });
                }

                socket.emit('mensajeEnviado', {
                    success: true,
                    mensaje: mensaje
                });

            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                socket.emit('error', {
                    message: 'Error al enviar mensaje',
                    error: error.message
                });
            }
        });

        // Evento: Obtener estadísticas de supervisión
        socket.on('obtenerEstadisticasSupervision', () => {
            try {
                // Aquí iría la consulta a la base de datos
                const estadisticas = {
                    vendedoresActivos: Math.floor(Math.random() * 10) + 5,
                    ventasHoy: Math.floor(Math.random() * 100) + 20,
                    ventasSemana: Math.floor(Math.random() * 500) + 100,
                    problemasReportados: Math.floor(Math.random() * 5),
                    solicitudesAyuda: Math.floor(Math.random() * 3),
                    ingresosDia: Math.floor(Math.random() * 5000) + 1000,
                    comisionesGeneradas: Math.floor(Math.random() * 500) + 100,
                    rifasSupervisionadas: Math.floor(Math.random() * 8) + 3,
                    timestamp: new Date()
                };

                socket.emit('estadisticasSupervision', estadisticas);

            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
                socket.emit('error', {
                    message: 'Error al obtener estadísticas',
                    error: error.message
                });
            }
        });

        // Evento: Aprobar/Rechazar venta
        socket.on('revisarVenta', (data) => {
            try {
                console.log(`✅ ${socket.userName} revisa venta:`, data);
                
                const revision = {
                    ventaId: data.ventaId,
                    supervisorId: socket.userId,
                    supervisorNombre: socket.userName,
                    accion: data.accion, // 'aprobar' o 'rechazar'
                    comentarios: data.comentarios,
                    timestamp: new Date()
                };

                // Notificar al vendedor correspondiente
                if (data.vendedorId) {
                    const vendedorRoom = io.sockets.adapter.rooms.get('vendedores');
                    if (vendedorRoom) {
                        vendedorRoom.forEach(socketId => {
                            const vendedorSocket = io.sockets.sockets.get(socketId);
                            if (vendedorSocket && vendedorSocket.userId === data.vendedorId) {
                                vendedorSocket.emit('ventaRevisada', revision);
                            }
                        });
                    }
                }

                socket.emit('ventaRevisadaConfirmacion', {
                    success: true,
                    revision: revision
                });

                // Notificar a administradores
                socket.to('administradores').emit('ventaRevisada', revision);

            } catch (error) {
                console.error('Error al revisar venta:', error);
                socket.emit('error', {
                    message: 'Error al revisar venta',
                    error: error.message
                });
            }
        });

        // Evento: Generar reporte de supervisor
        socket.on('generarReporte', (data) => {
            try {
                console.log(`📋 ${socket.userName} genera reporte:`, data);
                
                const reporte = {
                    id: Date.now(),
                    tipo: data.tipo, // 'diario', 'semanal', 'mensual'
                    periodo: data.periodo,
                    generadoPor: socket.userName,
                    supervisorId: socket.userId,
                    datos: {
                        ventas: Math.floor(Math.random() * 100) + 50,
                        ingresos: Math.floor(Math.random() * 10000) + 5000,
                        vendedoresActivos: Math.floor(Math.random() * 15) + 5,
                        problemasResueltos: Math.floor(Math.random() * 10),
                        comisionesGeneradas: Math.floor(Math.random() * 1000) + 500
                    },
                    timestamp: new Date()
                };

                socket.emit('reporteGenerado', reporte);

                // Notificar a administradores
                socket.to('administradores').emit('nuevoReporte', {
                    reporte: reporte,
                    supervisor: socket.userName
                });

            } catch (error) {
                console.error('Error al generar reporte:', error);
                socket.emit('error', {
                    message: 'Error al generar reporte',
                    error: error.message
                });
            }
        });

        // Evento: Broadcast a todos los vendedores
        socket.on('broadcastVendedores', (data) => {
            console.log(`📢 ${socket.userName} hace broadcast a vendedores:`, data);
            
            const broadcast = {
                de: socket.userName,
                mensaje: data.mensaje,
                tipo: data.tipo || 'info',
                timestamp: new Date()
            };

            // Enviar a todos los vendedores
            io.to('vendedores').emit('broadcastSupervisor', broadcast);

            socket.emit('broadcastEnviado', {
                success: true,
                broadcast: broadcast
            });
        });
    }
};

module.exports = supervisorSockets;
