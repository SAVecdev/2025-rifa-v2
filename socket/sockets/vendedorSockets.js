// Eventos de Socket.IO específicos para vendedores

const vendedorSockets = {
    setupEvents(socket, io) {
        console.log(`🛍️ Configurando eventos de vendedor para: ${socket.userName}`);

        // Evento: Registrar una nueva venta
        socket.on('registrarVenta', async (data) => {
            try {
                console.log(`💰 Nueva venta registrada por ${socket.userName}:`, data);
                
                // Aquí iría la lógica para guardar en la base de datos
                const venta = {
                    id: Date.now(),
                    rifaId: data.rifaId,
                    numerosBoletos: data.numerosBoletos,
                    cliente: data.cliente,
                    vendedorId: socket.userId,
                    vendedorNombre: socket.userName,
                    total: data.total,
                    fechaVenta: new Date(),
                    estado: 'completada'
                };

                // Confirmar al vendedor
                socket.emit('ventaRegistrada', {
                    success: true,
                    venta: venta,
                    message: 'Venta registrada exitosamente'
                });

                // Notificar a supervisores y administradores
                socket.to('supervisores').emit('nuevaVenta', {
                    venta: venta,
                    vendedor: socket.userName,
                    timestamp: new Date()
                });

                socket.to('administradores').emit('nuevaVenta', {
                    venta: venta,
                    vendedor: socket.userName,
                    timestamp: new Date()
                });

                // Actualizar estadísticas en tiempo real
                this.actualizarEstadisticasVentas(socket, io, venta);

            } catch (error) {
                console.error('Error al registrar venta:', error);
                socket.emit('error', {
                    message: 'Error al registrar la venta',
                    error: error.message
                });
            }
        });

        // Evento: Consultar disponibilidad de boletos
        socket.on('consultarDisponibilidad', async (data) => {
            try {
                console.log(`🎫 Consultando disponibilidad para rifa ${data.rifaId}`);
                
                // Aquí iría la lógica para consultar la base de datos
                const disponibilidad = {
                    rifaId: data.rifaId,
                    boletosDisponibles: Math.floor(Math.random() * 100) + 1, // Simulado
                    boletosVendidos: Math.floor(Math.random() * 50),
                    precioUnidad: 25,
                    timestamp: new Date()
                };

                socket.emit('disponibilidadConsultada', disponibilidad);

            } catch (error) {
                console.error('Error al consultar disponibilidad:', error);
                socket.emit('error', {
                    message: 'Error al consultar disponibilidad',
                    error: error.message
                });
            }
        });

        // Evento: Solicitar lista de rifas activas
        socket.on('obtenerRifasActivas', () => {
            try {
                // Aquí iría la consulta a la base de datos
                const rifasActivas = [
                    {
                        id: 1,
                        titulo: 'iPhone 15 Pro',
                        precio: 25,
                        boletosTotal: 100,
                        boletosVendidos: 65,
                        estado: 'activa',
                        fechaFin: new Date('2025-09-15')
                    },
                    {
                        id: 2,
                        titulo: 'PlayStation 5',
                        precio: 30,
                        boletosTotal: 80,
                        boletosVendidos: 72,
                        estado: 'activa',
                        fechaFin: new Date('2025-09-20')
                    }
                ];

                socket.emit('rifasActivas', rifasActivas);

            } catch (error) {
                console.error('Error al obtener rifas activas:', error);
                socket.emit('error', {
                    message: 'Error al obtener rifas activas',
                    error: error.message
                });
            }
        });

        // Evento: Reportar problema con una rifa
        socket.on('reportarProblema', (data) => {
            try {
                console.log(`⚠️ Problema reportado por ${socket.userName}:`, data);
                
                const reporte = {
                    id: Date.now(),
                    rifaId: data.rifaId,
                    problema: data.problema,
                    descripcion: data.descripcion,
                    vendedorId: socket.userId,
                    vendedorNombre: socket.userName,
                    timestamp: new Date(),
                    estado: 'pendiente'
                };

                // Confirmar al vendedor
                socket.emit('problemaReportado', {
                    success: true,
                    reporte: reporte,
                    message: 'Problema reportado exitosamente'
                });

                // Notificar a supervisores y administradores
                socket.to('supervisores').emit('nuevoProblema', {
                    reporte: reporte,
                    vendedor: socket.userName
                });

                socket.to('administradores').emit('nuevoProblema', {
                    reporte: reporte,
                    vendedor: socket.userName
                });

            } catch (error) {
                console.error('Error al reportar problema:', error);
                socket.emit('error', {
                    message: 'Error al reportar problema',
                    error: error.message
                });
            }
        });

        // Evento: Obtener estadísticas del vendedor
        socket.on('obtenerMisEstadisticas', () => {
            try {
                // Aquí iría la consulta a la base de datos
                const estadisticas = {
                    ventasHoy: Math.floor(Math.random() * 10) + 1,
                    ventasSemana: Math.floor(Math.random() * 50) + 10,
                    ventasMes: Math.floor(Math.random() * 200) + 50,
                    totalComisiones: Math.floor(Math.random() * 1000) + 100,
                    rifasActivas: 3,
                    clientesAtendidos: Math.floor(Math.random() * 30) + 5,
                    timestamp: new Date()
                };

                socket.emit('misEstadisticas', estadisticas);

            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
                socket.emit('error', {
                    message: 'Error al obtener estadísticas',
                    error: error.message
                });
            }
        });

        // Evento: Actualizar estado en línea
        socket.on('actualizarEstado', (estado) => {
            console.log(`🔄 ${socket.userName} actualizó su estado a: ${estado}`);
            
            // Notificar a supervisores
            socket.to('supervisores').emit('vendedorCambioEstado', {
                vendedorId: socket.userId,
                vendedorNombre: socket.userName,
                nuevoEstado: estado,
                timestamp: new Date()
            });
        });

        // Evento: Solicitar ayuda a supervisor
        socket.on('solicitarAyuda', (data) => {
            console.log(`🆘 ${socket.userName} solicita ayuda:`, data);
            
            const solicitud = {
                id: Date.now(),
                vendedorId: socket.userId,
                vendedorNombre: socket.userName,
                motivo: data.motivo,
                descripcion: data.descripcion,
                timestamp: new Date(),
                estado: 'pendiente'
            };

            // Confirmar al vendedor
            socket.emit('ayudaSolicitada', {
                success: true,
                solicitud: solicitud,
                message: 'Solicitud de ayuda enviada'
            });

            // Notificar a supervisores
            socket.to('supervisores').emit('solicitudAyuda', solicitud);
        });
    },

    // Método para actualizar estadísticas de ventas
    actualizarEstadisticasVentas(socket, io, venta) {
        const estadisticasActualizadas = {
            nuevaVenta: venta,
            ventasDelDia: Math.floor(Math.random() * 20) + 1,
            ingresosDia: Math.floor(Math.random() * 2000) + 500,
            timestamp: new Date()
        };

        // Enviar a todos los supervisores y administradores
        io.to('supervisores').emit('estadisticasActualizadas', estadisticasActualizadas);
        io.to('administradores').emit('estadisticasActualizadas', estadisticasActualizadas);
    }
};

module.exports = vendedorSockets;
