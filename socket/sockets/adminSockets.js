// Eventos de Socket.IO específicos para administradores

const adminSockets = {
    setupEvents(socket, io) {
        console.log(`👑 Configurando eventos de administrador para: ${socket.userName}`);

        // Evento: Obtener dashboard completo del sistema
        socket.on('obtenerDashboardAdmin', () => {
            try {
                // Simular datos del dashboard (en producción vendrían de la base de datos)
                const dashboard = {
                    usuariosConectados: {
                        vendedores: io.sockets.adapter.rooms.get('vendedores')?.size || 0,
                        supervisores: io.sockets.adapter.rooms.get('supervisores')?.size || 0,
                        administradores: io.sockets.adapter.rooms.get('administradores')?.size || 0,
                        total: io.sockets.sockets.size
                    },
                    estadisticasGenerales: {
                        ventasHoy: Math.floor(Math.random() * 500) + 100,
                        ventasSemana: Math.floor(Math.random() * 2000) + 500,
                        ventasMes: Math.floor(Math.random() * 8000) + 2000,
                        ingresosDia: Math.floor(Math.random() * 15000) + 5000,
                        ingresosSemanales: Math.floor(Math.random() * 50000) + 20000,
                        ingresosMensuales: Math.floor(Math.random() * 200000) + 80000,
                        rifasActivas: Math.floor(Math.random() * 20) + 10,
                        usuariosRegistrados: Math.floor(Math.random() * 1000) + 500,
                        comisionesTotales: Math.floor(Math.random() * 10000) + 5000
                    },
                    alertas: [
                        {
                            id: 1,
                            tipo: 'warning',
                            mensaje: 'Rifa iPhone 15 Pro cerca de completarse',
                            timestamp: new Date()
                        },
                        {
                            id: 2,
                            tipo: 'info',
                            mensaje: 'Nuevo vendedor registrado',
                            timestamp: new Date()
                        }
                    ],
                    timestamp: new Date()
                };

                socket.emit('dashboardAdmin', dashboard);

            } catch (error) {
                console.error('Error al obtener dashboard admin:', error);
                socket.emit('error', {
                    message: 'Error al obtener dashboard',
                    error: error.message
                });
            }
        });

        // Evento: Gestionar usuarios (crear, editar, eliminar)
        socket.on('gestionarUsuario', (data) => {
            try {
                console.log(`👥 ${socket.userName} gestiona usuario:`, data);
                
                const accion = {
                    id: Date.now(),
                    tipo: data.tipo, // 'crear', 'editar', 'eliminar', 'activar', 'desactivar'
                    usuarioId: data.usuarioId,
                    datosUsuario: data.datosUsuario,
                    ejecutadoPor: socket.userName,
                    administradorId: socket.userId,
                    timestamp: new Date()
                };

                // Simular respuesta exitosa
                const resultado = {
                    success: true,
                    accion: accion,
                    message: `Usuario ${data.tipo} exitosamente`
                };

                socket.emit('usuarioGestionado', resultado);

                // Notificar a otros administradores
                socket.to('administradores').emit('cambioUsuario', accion);

                // Si es un supervisor o vendedor, notificar a sus salas
                if (data.datosUsuario?.role) {
                    const roleSala = data.datosUsuario.role === 'supervisor' ? 'supervisores' : 'vendedores';
                    io.to(roleSala).emit('actualizacionSistema', {
                        tipo: 'usuario_actualizado',
                        mensaje: 'Se han actualizado los permisos del sistema',
                        timestamp: new Date()
                    });
                }

            } catch (error) {
                console.error('Error al gestionar usuario:', error);
                socket.emit('error', {
                    message: 'Error al gestionar usuario',
                    error: error.message
                });
            }
        });

        // Evento: Gestionar rifas (crear, editar, eliminar, activar, finalizar)
        socket.on('gestionarRifa', (data) => {
            try {
                console.log(`🎫 ${socket.userName} gestiona rifa:`, data);
                
                const accionRifa = {
                    id: Date.now(),
                    tipo: data.tipo, // 'crear', 'editar', 'eliminar', 'activar', 'finalizar', 'pausar'
                    rifaId: data.rifaId,
                    datosRifa: data.datosRifa,
                    ejecutadoPor: socket.userName,
                    administradorId: socket.userId,
                    timestamp: new Date()
                };

                socket.emit('rifaGestionada', {
                    success: true,
                    accion: accionRifa,
                    message: `Rifa ${data.tipo} exitosamente`
                });

                // Notificar a todos los usuarios sobre cambios en rifas
                io.emit('cambioRifa', {
                    tipo: data.tipo,
                    rifa: data.datosRifa,
                    mensaje: `La rifa "${data.datosRifa?.titulo}" ha sido ${data.tipo}`,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Error al gestionar rifa:', error);
                socket.emit('error', {
                    message: 'Error al gestionar rifa',
                    error: error.message
                });
            }
        });

        // Evento: Obtener reportes del sistema
        socket.on('obtenerReportes', (data) => {
            try {
                console.log(`📊 ${socket.userName} solicita reportes:`, data);
                
                const reportes = {
                    ventas: {
                        diarias: this.generarReporteVentas('diario'),
                        semanales: this.generarReporteVentas('semanal'),
                        mensuales: this.generarReporteVentas('mensual')
                    },
                    usuarios: {
                        activos: Math.floor(Math.random() * 100) + 50,
                        registradosHoy: Math.floor(Math.random() * 10) + 2,
                        porRol: {
                            vendedores: Math.floor(Math.random() * 50) + 20,
                            supervisores: Math.floor(Math.random() * 10) + 5,
                            administradores: Math.floor(Math.random() * 3) + 2
                        }
                    },
                    sistema: {
                        uptime: process.uptime(),
                        conexionesActivas: io.sockets.sockets.size,
                        erroresTotales: Math.floor(Math.random() * 10),
                        rendimiento: 'Óptimo'
                    },
                    timestamp: new Date()
                };

                socket.emit('reportesObtenidos', reportes);

            } catch (error) {
                console.error('Error al obtener reportes:', error);
                socket.emit('error', {
                    message: 'Error al obtener reportes',
                    error: error.message
                });
            }
        });

        // Evento: Enviar notificación global
        socket.on('enviarNotificacionGlobal', (data) => {
            try {
                console.log(`📢 ${socket.userName} envía notificación global:`, data);
                
                const notificacion = {
                    id: Date.now(),
                    titulo: data.titulo,
                    mensaje: data.mensaje,
                    tipo: data.tipo || 'info', // 'info', 'warning', 'error', 'success'
                    de: socket.userName,
                    administradorId: socket.userId,
                    timestamp: new Date()
                };

                // Enviar a todos los usuarios conectados
                io.emit('notificacionGlobal', notificacion);

                socket.emit('notificacionEnviada', {
                    success: true,
                    notificacion: notificacion
                });

            } catch (error) {
                console.error('Error al enviar notificación:', error);
                socket.emit('error', {
                    message: 'Error al enviar notificación',
                    error: error.message
                });
            }
        });

        // Evento: Configurar sistema
        socket.on('configurarSistema', (data) => {
            try {
                console.log(`⚙️ ${socket.userName} configura sistema:`, data);
                
                const configuracion = {
                    id: Date.now(),
                    configuraciones: data.configuraciones,
                    configuradoPor: socket.userName,
                    administradorId: socket.userId,
                    timestamp: new Date()
                };

                socket.emit('sistemaConfigurado', {
                    success: true,
                    configuracion: configuracion,
                    message: 'Configuración actualizada exitosamente'
                });

                // Notificar a otros administradores
                socket.to('administradores').emit('configuracionCambiada', configuracion);

                // Si afecta a otros roles, notificar
                if (data.afectaVendedores) {
                    io.to('vendedores').emit('actualizacionSistema', {
                        tipo: 'configuracion',
                        mensaje: 'Se han actualizado las configuraciones del sistema',
                        timestamp: new Date()
                    });
                }

                if (data.afectaSupervisores) {
                    io.to('supervisores').emit('actualizacionSistema', {
                        tipo: 'configuracion',
                        mensaje: 'Se han actualizado las configuraciones del sistema',
                        timestamp: new Date()
                    });
                }

            } catch (error) {
                console.error('Error al configurar sistema:', error);
                socket.emit('error', {
                    message: 'Error al configurar sistema',
                    error: error.message
                });
            }
        });

        // Evento: Monitorear actividad del sistema
        socket.on('iniciarMonitoreoSistema', () => {
            console.log(`🔍 ${socket.userName} inició monitoreo del sistema`);
            
            socket.join('monitoreo_sistema');
            
            // Enviar estadísticas en tiempo real cada 10 segundos
            const intervalo = setInterval(() => {
                if (socket.connected) {
                    const estadisticas = {
                        conexionesActivas: io.sockets.sockets.size,
                        salas: {
                            vendedores: io.sockets.adapter.rooms.get('vendedores')?.size || 0,
                            supervisores: io.sockets.adapter.rooms.get('supervisores')?.size || 0,
                            administradores: io.sockets.adapter.rooms.get('administradores')?.size || 0
                        },
                        memoria: process.memoryUsage(),
                        uptime: process.uptime(),
                        timestamp: new Date()
                    };
                    
                    socket.emit('estadisticasSistema', estadisticas);
                } else {
                    clearInterval(intervalo);
                }
            }, 10000);

            socket.emit('monitoreoSistemaIniciado', {
                message: 'Monitoreo del sistema activado',
                timestamp: new Date()
            });
        });

        // Evento: Obtener logs del sistema
        socket.on('obtenerLogs', (data) => {
            try {
                // Simular logs del sistema
                const logs = [
                    {
                        timestamp: new Date(),
                        nivel: 'info',
                        mensaje: `Usuario ${socket.userName} conectado`,
                        modulo: 'auth'
                    },
                    {
                        timestamp: new Date(Date.now() - 60000),
                        nivel: 'warning',
                        mensaje: 'Conexión a base de datos lenta',
                        modulo: 'database'
                    },
                    {
                        timestamp: new Date(Date.now() - 120000),
                        nivel: 'error',
                        mensaje: 'Error al procesar pago',
                        modulo: 'payments'
                    }
                ];

                socket.emit('logsObtenidos', logs);

            } catch (error) {
                console.error('Error al obtener logs:', error);
                socket.emit('error', {
                    message: 'Error al obtener logs',
                    error: error.message
                });
            }
        });
    },

    // Método auxiliar para generar reportes de ventas
    generarReporteVentas(periodo) {
        const base = periodo === 'diario' ? 50 : periodo === 'semanal' ? 300 : 1200;
        return {
            ventas: Math.floor(Math.random() * base) + base / 2,
            ingresos: Math.floor(Math.random() * base * 25) + base * 12,
            comisiones: Math.floor(Math.random() * base * 5) + base * 2,
            periodo: periodo
        };
    }
};

module.exports = adminSockets;
