/**
 * Middleware personalizado para mensajes flash
 * Reemplaza connect-flash para evitar advertencias de deprecación
 */

const flashMiddleware = (req, res, next) => {
    // Inicializar flash en la sesión si no existe
    if (!req.session.flash) {
        req.session.flash = {};
    }

    // Función para agregar mensajes flash
    req.flash = (type, message) => {
        if (message === undefined) {
            // Si solo se pasa un parámetro, devolver los mensajes de ese tipo
            const messages = req.session.flash[type] || [];
            delete req.session.flash[type];
            return messages;
        } else {
            // Si se pasan dos parámetros, agregar el mensaje
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            req.session.flash[type].push(message);
        }
    };

    // Hacer disponibles todos los mensajes flash en res.locals
    res.locals.messages = {};
    if (req.session.flash) {
        for (const type in req.session.flash) {
            res.locals.messages[type] = req.session.flash[type];
        }
        // Limpiar los mensajes después de pasarlos a las vistas
        req.session.flash = {};
    }

    next();
};

module.exports = flashMiddleware;
