const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const initDatabase = async () => {
    try {
        console.log('🔄 Inicializando base de datos...');
        
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, 'schema.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // Dividir las consultas por punto y coma
        const queries = sqlContent
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);
        
        // Ejecutar cada consulta
        for (const sqlQuery of queries) {
            try {
                await query(sqlQuery);
                console.log('✅ Query ejecutada exitosamente');
            } catch (error) {
                if (error.code !== 'ER_DUP_ENTRY') {
                    console.error('❌ Error ejecutando query:', error.message);
                }
            }
        }
        
        console.log('✅ Base de datos inicializada correctamente');
        console.log('\n📝 Credenciales de acceso:');
        console.log('Admin: admin@rifas.com / admin123');
        console.log('Usuario: user@rifas.com / user123');
        console.log('Supervisor: supervisor@rifas.com / user123');
        
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        throw error;
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    initDatabase()
        .then(() => {
            console.log('🎉 Proceso completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error:', error);
            process.exit(1);
        });
}

module.exports = { initDatabase };
