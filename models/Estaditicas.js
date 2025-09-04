const bcrypt = require('bcryptjs');
const { query, queryOne, insert } = require('../config/database');

class EstadisticaModel {
    // estadisticas semanales
    static async semanales() {
        try {
            const sql = `
                SELECT fecha, SUM(utilidad_neta) as total 
                FROM rifas.estadisticas_consolidada_semanal 
                GROUP BY fecha;`;
            return await query(sql);
        } catch (error) {
            console.error('Error en semanales:', error);
            throw error;
        }
    }
    // resumen de estadisticas Semanales

}

module.exports = EstadisticaModel;
