const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    idleTimeout: 60000,
    supportBigNumbers: true,
    dateStrings: false,
    multipleStatements: false,

};

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con MySQL:', error.message);
        return false;
    }
};

// Función para ejecutar queries
const query = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Error en query:', error);
        throw error;
    }
};

// Función para obtener una sola fila
const queryOne = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows[0] || null;
    } catch (error) {
        console.error('Error en queryOne:', error);
        throw error;
    }
};

// Función para insertar y obtener el ID
const insert = async (sql, params = []) => {
    try {
        const [result] = await pool.execute(sql, params);
        return {
            insertId: result.insertId,
            affectedRows: result.affectedRows
        };
    } catch (error) {
        console.error('Error en insert:', error);
        throw error;
    }
};

module.exports = {
    pool,
    query,
    queryOne,
    insert,
    testConnection
};
