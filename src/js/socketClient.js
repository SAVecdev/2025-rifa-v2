// Cliente Socket.IO para manejo de conexiones en tiempo real

class SocketClient {
    constructor() {
        this.socket = null;
        this.userRole = null;
        this.userName = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    // Inicializar conexión Socket.IO
    init(userRole, userName, userId) {
        try {
            this.userRole = userRole;
            this.userName = userName;
            this.userId = userId;

            // Conectar a Socket.IO
            this.socket = io({
                transports: ['websocket', 'polling'],
                upgrade: true,
                rememberUpgrade: true,
                timeout: 20000
            });

            this.setupEventListeners();
            this.setupRoleSpecificListeners();

            console.log(`🔌 Iniciando conexión Socket.IO como ${userRole}...`);

        } catch (error) {
            console.error('Error al inicializar Socket.IO:', error);
            this.showNotification('Error de conexión', 'error');
        }
    }

    // Configurar event listeners generales
    setupEventListeners() {
        // Conexión exitosa
        this.socket.on('connect', () => {
            console.log('✅ Conectado a Socket.IO');
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // Autenticar usuario
            this.socket.emit('autenticar', {
                role: this.userRole,
                userName: this.userName,
                userId: this.userId
            });

            this.updateConnectionStatus(true);
        });

        // Desconexión
        this.socket.on('disconnect', (reason) => {
            console.log('❌ Desconectado de Socket.IO:', reason);
            this.isConnected = false;
            this.updateConnectionStatus(false);

            if (reason === 'io server disconnect') {
                // El servidor forzó la desconexión, intentar reconectar
                this.attemptReconnect();
            }
        });

        // Error de conexión
        this.socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión Socket.IO:', error);
            this.updateConnectionStatus(false);
            this.attemptReconnect();
        });

        // Usuario autenticado
        this.socket.on('autenticado', (data) => {
            console.log('🔐 Usuario autenticado:', data);
            this.showNotification(`Conectado como ${this.userRole}`, 'success');
        });

        // Error de autenticación
        this.socket.on('error_autenticacion', (data) => {
            console.error('🚫 Error de autenticación:', data);
            this.showNotification('Error de autenticación', 'error');
        });

        // Notificaciones globales
        this.socket.on('notificacionGlobal', (notificacion) => {
            this.showNotification(notificacion.mensaje, notificacion.tipo, notificacion.titulo);
        });

        // Actualización del sistema
        this.socket.on('actualizacionSistema', (data) => {
            this.showNotification(data.mensaje, 'info', 'Actualización del Sistema');
        });

        // Errores generales
        this.socket.on('error', (error) => {
            console.error('❌ Error del servidor:', error);
            this.showNotification(error.message || 'Error del servidor', 'error');
        });
    }

    // Configurar listeners específicos por rol
    setupRoleSpecificListeners() {
        switch (this.userRole) {
            case 'vendedor':
                this.setupVendedorListeners();
                break;
            case 'supervisor':
                this.setupSupervisorListeners();
                break;
            case 'administrador':
                this.setupAdminListeners();
                break;
        }
    }

    // Listeners para vendedores
    setupVendedorListeners() {
        console.log('🏪 Configurando eventos de vendedor...');

        this.socket.on('ventaRegistrada', (data) => {
            console.log('💰 Venta registrada:', data);
            this.showNotification('Venta registrada exitosamente', 'success');
            this.updateVentasDisplay(data);
        });

        this.socket.on('disponibilidadRifa', (data) => {
            console.log('🎫 Disponibilidad rifa:', data);
            this.updateDisponibilidadDisplay(data);
        });

        this.socket.on('rifasActivas', (rifas) => {
            console.log('📋 Rifas activas:', rifas);
            this.updateRifasActivasDisplay(rifas);
        });

        this.socket.on('problemaReportado', (data) => {
            this.showNotification('Problema reportado al supervisor', 'info');
        });

        this.socket.on('estadisticasVendedor', (stats) => {
            this.updateEstadisticasDisplay(stats);
        });

        this.socket.on('cambioRifa', (data) => {
            this.showNotification(`Rifa actualizada: ${data.mensaje}`, 'info');
            this.refreshRifasList();
        });
    }

    // Listeners para supervisores
    setupSupervisorListeners() {
        console.log('👨‍💼 Configurando eventos de supervisor...');

        this.socket.on('vendedoresEnLinea', (vendedores) => {
            console.log('👥 Vendedores en línea:', vendedores);
            this.updateVendedoresEnLineaDisplay(vendedores);
        });

        this.socket.on('solicitudAyuda', (solicitud) => {
            console.log('🆘 Nueva solicitud de ayuda:', solicitud);
            this.showNotification(`${solicitud.vendedor} necesita ayuda`, 'warning');
            this.addSolicitudAyuda(solicitud);
        });

        this.socket.on('ventaPendiente', (venta) => {
            console.log('⏳ Venta pendiente de revisión:', venta);
            this.showNotification('Nueva venta pendiente de revisión', 'info');
            this.addVentaPendiente(venta);
        });

        this.socket.on('reporteGenerado', (reporte) => {
            console.log('📊 Reporte generado:', reporte);
            this.showNotification('Reporte generado exitosamente', 'success');
            this.displayReporte(reporte);
        });

        this.socket.on('ayudaRespondida', (data) => {
            this.showNotification('Respuesta de ayuda enviada', 'success');
        });

        this.socket.on('ventaRevisada', (data) => {
            this.showNotification(`Venta ${data.accion}`, 'success');
            this.updateVentaStatus(data);
        });
    }

    // Listeners para administradores
    setupAdminListeners() {
        console.log('👑 Configurando eventos de administrador...');

        this.socket.on('dashboardAdmin', (dashboard) => {
            console.log('📊 Dashboard admin:', dashboard);
            this.updateDashboardAdmin(dashboard);
        });

        this.socket.on('usuarioGestionado', (data) => {
            this.showNotification(data.message, 'success');
            this.refreshUsuariosList();
        });

        this.socket.on('rifaGestionada', (data) => {
            this.showNotification(data.message, 'success');
            this.refreshRifasList();
        });

        this.socket.on('reportesObtenidos', (reportes) => {
            console.log('📈 Reportes obtenidos:', reportes);
            this.displayReportesAdmin(reportes);
        });

        this.socket.on('notificacionEnviada', (data) => {
            this.showNotification('Notificación enviada a todos los usuarios', 'success');
        });

        this.socket.on('sistemaConfigurado', (data) => {
            this.showNotification('Configuración actualizada', 'success');
        });

        this.socket.on('estadisticasSistema', (stats) => {
            this.updateEstadisticasSistema(stats);
        });

        this.socket.on('logsObtenidos', (logs) => {
            this.displayLogs(logs);
        });

        this.socket.on('cambioUsuario', (accion) => {
            this.showNotification(`Usuario ${accion.tipo} por otro administrador`, 'info');
            this.refreshUsuariosList();
        });

        this.socket.on('configuracionCambiada', (config) => {
            this.showNotification('Configuración actualizada por otro administrador', 'info');
        });
    }

    // Métodos para emitir eventos

    // Vendedor: Registrar venta
    registrarVenta(ventaData) {
        if (this.isConnected && this.userRole === 'vendedor') {
            this.socket.emit('registrarVenta', ventaData);
        }
    }

    // Vendedor: Consultar disponibilidad
    consultarDisponibilidad(rifaId) {
        if (this.isConnected && this.userRole === 'vendedor') {
            this.socket.emit('consultarDisponibilidad', { rifaId });
        }
    }

    // Vendedor: Obtener rifas activas
    obtenerRifasActivas() {
        if (this.isConnected && this.userRole === 'vendedor') {
            this.socket.emit('obtenerRifasActivas');
        }
    }

    // Vendedor: Reportar problema
    reportarProblema(problema) {
        if (this.isConnected && this.userRole === 'vendedor') {
            this.socket.emit('reportarProblema', problema);
        }
    }

    // Supervisor: Obtener vendedores en línea
    obtenerVendedoresEnLinea() {
        if (this.isConnected && this.userRole === 'supervisor') {
            this.socket.emit('obtenerVendedoresEnLinea');
        }
    }

    // Supervisor: Responder solicitud de ayuda
    responderSolicitudAyuda(respuesta) {
        if (this.isConnected && this.userRole === 'supervisor') {
            this.socket.emit('responderSolicitudAyuda', respuesta);
        }
    }

    // Admin: Obtener dashboard
    obtenerDashboardAdmin() {
        if (this.isConnected && this.userRole === 'administrador') {
            this.socket.emit('obtenerDashboardAdmin');
        }
    }

    // Admin: Gestionar usuario
    gestionarUsuario(data) {
        if (this.isConnected && this.userRole === 'administrador') {
            this.socket.emit('gestionarUsuario', data);
        }
    }

    // Admin: Enviar notificación global
    enviarNotificacionGlobal(notificacion) {
        if (this.isConnected && this.userRole === 'administrador') {
            this.socket.emit('enviarNotificacionGlobal', notificacion);
        }
    }

    // Métodos de reconexión
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Intento de reconexión ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
            
            setTimeout(() => {
                if (this.socket) {
                    this.socket.connect();
                }
            }, 2000 * this.reconnectAttempts);
        } else {
            console.log('❌ Máximo de intentos de reconexión alcanzado');
            this.showNotification('No se pudo reconectar al servidor', 'error');
        }
    }

    // Métodos de UI (estos deben ser implementados según el diseño específico)
    
    updateConnectionStatus(isConnected) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.className = `fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                isConnected ? 'connected bg-green-600 text-green-100' : 'disconnected bg-red-600 text-red-100'
            }`;
            
            const icon = statusElement.querySelector('i');
            const text = statusElement.querySelector('span');
            
            if (icon && text) {
                text.textContent = isConnected ? 'Conectado' : 'Desconectado';
                icon.className = 'fas fa-circle mr-1';
            }
        }
    }

    showNotification(message, type = 'info', title = '') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type} p-4 rounded-lg border-l-4 shadow-lg mb-2`;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${iconMap[type] || iconMap.info} mr-3 text-lg"></i>
                <div class="flex-1">
                    ${title ? `<div class="font-semibold">${title}</div>` : ''}
                    <div class="text-sm">${message}</div>
                </div>
                <button class="ml-3 text-lg hover:opacity-70" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Agregar al DOM
        let container = document.getElementById('notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications-container';
            container.className = 'fixed top-4 right-4 z-50 max-w-md';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Log en consola
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    }

    // Métodos de actualización de UI específicos (implementar según necesidades)
    updateVentasDisplay(data) { /* Implementar */ }
    updateDisponibilidadDisplay(data) { /* Implementar */ }
    updateRifasActivasDisplay(rifas) { /* Implementar */ }
    updateEstadisticasDisplay(stats) { /* Implementar */ }
    updateVendedoresEnLineaDisplay(vendedores) { /* Implementar */ }
    addSolicitudAyuda(solicitud) { /* Implementar */ }
    addVentaPendiente(venta) { /* Implementar */ }
    displayReporte(reporte) { /* Implementar */ }
    updateVentaStatus(data) { /* Implementar */ }
    updateDashboardAdmin(dashboard) { /* Implementar */ }
    displayReportesAdmin(reportes) { /* Implementar */ }
    updateEstadisticasSistema(stats) { /* Implementar */ }
    displayLogs(logs) { /* Implementar */ }
    refreshUsuariosList() { /* Implementar */ }
    refreshRifasList() { /* Implementar */ }

    // Desconectar
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
}

// Exportar para uso global
window.SocketClient = SocketClient;
