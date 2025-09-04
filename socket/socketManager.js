const { Server } = require('socket.io');
const vendedorSockets = require('./sockets/vendedorSockets');
const supervisorSockets = require('./sockets/supervisorSockets');
const adminSockets = require('./sockets/adminSockets');

class SocketManager {
    constructor(io) {
        this.io = io;
        this.connectedUsers = new Map(); // Almacenar usuarios conectados
        this.userRooms = new Map(); // Mapear usuarios a sus salas
    }

    initialize() {
        this.setupMiddleware();
        this.setupConnections();
        
        console.log('✅ Socket.IO inicializado correctamente');
        return this.io;
    }

    setupMiddleware() {
        // Middleware para autenticación de sockets
        this.io.use((socket, next) => {
            // Por ahora permitir todas las conexiones
            // En producción aquí validarías la sesión
            next();
        });
    }

    setupConnections() {
        this.io.on('connection', (socket) => {
            console.log(`👤 Usuario conectado: ${socket.id}`);
            
            // Manejar autenticación del usuario
            socket.on('autenticar', (userData) => {
                socket.userId = userData.userId;
                socket.userRole = userData.role;
                socket.userName = userData.userName;
                
                // Almacenar información del usuario conectado
                this.connectedUsers.set(socket.userId, {
                    socketId: socket.id,
                    name: socket.userName,
                    role: socket.userRole,
                    connectedAt: new Date()
                });

                // Unir a sala según el rol
                this.joinRoleRoom(socket);
                
                // Configurar eventos específicos del rol
                this.setupRoleEvents(socket);
                
                // Configurar eventos generales
                this.setupGeneralEvents(socket);
                
                // Confirmar autenticación
                socket.emit('autenticado', {
                    success: true,
                    role: socket.userRole,
                    message: 'Autenticación exitosa'
                });
                
                console.log(`🔐 Usuario autenticado: ${socket.userName} (${socket.userRole})`);
            });

            // Manejar desconexión
            socket.on('disconnect', (reason) => {
                console.log(`👤 Usuario desconectado: ${socket.userName || socket.id} - Razón: ${reason}`);
                
                if (socket.userId) {
                    this.connectedUsers.delete(socket.userId);
                    this.notifyUserDisconnection(socket);
                }
            });
        });
    }

    joinRoleRoom(socket) {
        if (!socket.userRole) return;
        
        const roleName = socket.userRole; // vendedor -> vendedores
        socket.join(roleName);
        this.userRooms.set(socket.userId, roleName);
        
        console.log(`🏠 ${socket.userName} se unió a la sala: ${roleName}`);
        
        // Notificar a otros usuarios del mismo rol
        socket.to(roleName).emit('usuarioConectado', {
            id: socket.userId,
            name: socket.userName,
            role: socket.userRole,
            timestamp: new Date()
        });
    }

    setupRoleEvents(socket) {
        switch (socket.userRole) {
            case 'vendedor':
                vendedorSockets.setupEvents(socket, this.io);
                break;
            case 'supervisor':
                supervisorSockets.setupEvents(socket, this.io);
                break;
            case 'administrador':
                adminSockets.setupEvents(socket, this.io);
                break;
        }
    }

    setupGeneralEvents(socket) {
        // Evento para obtener usuarios conectados
        socket.on('obtenerUsuariosConectados', () => {
            const usuarios = this.getConnectedUsers();
            socket.emit('usuariosConectados', usuarios);
        });
        
        // Evento para enviar mensaje directo
        socket.on('mensajeDirecto', (data) => {
            const targetSocket = this.io.sockets.sockets.get(data.targetSocketId);
            if (targetSocket) {
                targetSocket.emit('mensajeRecibido', {
                    from: socket.userName,
                    message: data.message,
                    timestamp: new Date()
                });
            }
        });
        
        // Evento ping para mantener conexión
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: new Date() });
        });
    }

    notifyUserDisconnection(socket) {
        if (socket.userRole) {
            const roleName = socket.userRole + 's';
            this.io.to(roleName).emit('usuarioDesconectado', {
                id: socket.userId,
                name: socket.userName,
                role: socket.userRole,
                timestamp: new Date()
            });
        }
    }

    // Métodos utilitarios
    getConnectedUsers() {
        return Array.from(this.connectedUsers.values());
    }

    getUsersByRole(role) {
        return Array.from(this.connectedUsers.values()).filter(user => user.role === role);
    }

    emitToRole(role, event, data) {
        const roleName = role + 's';
        this.io.to(roleName).emit(event, data);
    }

    emitToUser(userId, event, data) {
        const user = this.connectedUsers.get(userId);
        if (user) {
            this.io.to(user.socketId).emit(event, data);
        }
    }

    emitToAll(event, data) {
        this.io.emit(event, data);
    }
}

module.exports = SocketManager;
