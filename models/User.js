const bcrypt = require('bcryptjs');
const { query, queryOne, insert } = require('../config/database');

class UserModel {
    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const sql = `
                SELECT id, Nombre as name, Correo as email, Clave as password, 
                       Foto as avatar, Estado as status, Rol as role, 
                       id_Sucursal_Responsable as branchResponsibleId,
                       Configuracion as config, id_Sucursal as branchId,
                       created_at, updated_at
                FROM usuario 
                WHERE Correo = ? AND Estado = 'activo'
            `;
            return await queryOne(sql, [email]);
        } catch (error) {
            console.error('Error en findByEmail:', error);
            throw error;
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const sql = `
                SELECT id, Nombre as name, Correo as email, Clave as password, 
                       Foto as avatar, Estado as status, Rol as role, 
                       id_Sucursal_Responsable as branchResponsibleId,
                       Configuracion as config, id_Sucursal as branchId,
                       created_at, updated_at
                FROM usuario 
                WHERE id = ? AND Estado = 'activo'
            `;
            return await queryOne(sql, [id]);
        } catch (error) {
            console.error('Error en findById:', error);
            throw error;
        }
    }

    // Validar contraseña
    static async validatePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error en validatePassword:', error);
            return false;
        }
    }

    // Crear nuevo usuario
    static async create(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            const sql = `
                INSERT INTO usuario (Nombre, Correo, Clave, Foto, Estado, Rol, Configuracion, id_Sucursal)
                VALUES (?, ?, ?, ?, 'activo', ?, ?, ?)
            `;
            
            const avatar = userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=ffffff`;
            const role = userData.role || 'vendedor';
            const config = userData.config || JSON.stringify({
                theme: 'dark',
                notifications: true,
                language: 'es'
            });
            
            const params = [
                userData.name,
                userData.email,
                hashedPassword,
                avatar,
                role,
                config,
                userData.branchId || null
            ];
            
            const result = await insert(sql, params);
            
            // Obtener el usuario creado
            return await this.findById(result.insertId);
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    // Obtener todos los usuarios activos
    static async getAllUsers(limit = 50, offset = 0) {
        try {
            const sql = `
                SELECT id, Nombre as name, Correo as email, 
                       Foto as avatar, Estado as status, Rol as role, 
                       id_Sucursal_Responsable as branchResponsibleId,
                       id_Sucursal as branchId, created_at, updated_at
                FROM usuario 
                WHERE Estado = 'activo'
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;
            return await query(sql, [limit, offset]);
        } catch (error) {
            console.error('Error en getAllUsers:', error);
            throw error;
        }
    }

    // Actualizar usuario
    static async update(id, userData) {
        try {
            const updates = [];
            const params = [];
            
            if (userData.name) {
                updates.push('Nombre = ?');
                params.push(userData.name);
            }
            
            if (userData.email) {
                updates.push('Correo = ?');
                params.push(userData.email);
            }
            
            if (userData.password) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                updates.push('Clave = ?');
                params.push(hashedPassword);
            }
            
            if (userData.avatar) {
                updates.push('Foto = ?');
                params.push(userData.avatar);
            }
            
            if (userData.status) {
                updates.push('Estado = ?');
                params.push(userData.status);
            }
            
            if (userData.role) {
                updates.push('Rol = ?');
                params.push(userData.role);
            }
            
            if (userData.branchId !== undefined) {
                updates.push('id_Sucursal = ?');
                params.push(userData.branchId);
            }
            
            if (userData.branchResponsibleId !== undefined) {
                updates.push('id_Sucursal_Responsable = ?');
                params.push(userData.branchResponsibleId);
            }
            
            if (userData.config) {
                updates.push('Configuracion = ?');
                params.push(typeof userData.config === 'string' ? userData.config : JSON.stringify(userData.config));
            }
            
            if (updates.length === 0) {
                throw new Error('No hay datos para actualizar');
            }
            
            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(id);
            
            const sql = `UPDATE usuario SET ${updates.join(', ')} WHERE id = ?`;
            await query(sql, params);
            
            return await this.findById(id);
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    // Desactivar usuario (soft delete)
    static async deactivate(id) {
        try {
            const sql = `UPDATE usuario SET Estado = 'inactivo', updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            await query(sql, [id]);
            return true;
        } catch (error) {
            console.error('Error en deactivate:', error);
            throw error;
        }
    }

    // Obtener usuarios por rol
    static async findByRole(role) {
        try {
            const sql = `
                SELECT id, Nombre as name, Correo as email, 
                       Foto as avatar, Estado as status, Rol as role, 
                       id_Sucursal_Responsable as branchResponsibleId,
                       id_Sucursal as branchId, created_at, updated_at
                FROM usuario 
                WHERE Rol = ? AND Estado = 'activo'
                ORDER BY Nombre ASC
            `;
            return await query(sql, [role]);
        } catch (error) {
            console.error('Error en findByRole:', error);
            throw error;
        }
    }

    // Obtener usuarios por sucursal
    static async findByBranch(branchId) {
        try {
            const sql = `
                SELECT id, Nombre as name, Correo as email, 
                       Foto as avatar, Estado as status, Rol as role, 
                       id_Sucursal_Responsable as branchResponsibleId,
                       id_Sucursal as branchId, created_at, updated_at
                FROM usuario 
                WHERE id_Sucursal = ? AND Estado = 'activo'
                ORDER BY Nombre ASC
            `;
            return await query(sql, [branchId]);
        } catch (error) {
            console.error('Error en findByBranch:', error);
            throw error;
        }
    }

    // Contar usuarios por estado
    static async countByStatus() {
        try {
            const sql = `
                SELECT Estado as status, COUNT(*) as count 
                FROM usuario 
                GROUP BY Estado
            `;
            return await query(sql);
        } catch (error) {
            console.error('Error en countByStatus:', error);
            throw error;
        }
    }
}

module.exports = UserModel;

module.exports = UserModel;
