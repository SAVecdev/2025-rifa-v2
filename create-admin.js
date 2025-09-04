const bcrypt = require('bcryptjs');
const { query } = require('./config/database');

async function createAdminUser() {
    try {
        // Hash de la contraseña 'admin123'
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const sql = `
            INSERT INTO usuario (Nombre, Correo, Clave, Rol, Estado) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            Nombre = VALUES(Nombre), 
            Clave = VALUES(Clave), 
            Rol = VALUES(Rol),
            Estado = VALUES(Estado)
        `;
        
        await query(sql, ['Admin User', 'admin@rifas.com', hashedPassword, 'administrador', 'activo']);
        console.log('✅ Usuario administrador creado/actualizado exitosamente');
        console.log('📧 Email: admin@rifas.com');
        console.log('🔑 Contraseña: admin123');
        
    } catch (error) {
        console.error('❌ Error creando usuario administrador:', error);
    }
}

createAdminUser();
