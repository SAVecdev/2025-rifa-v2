# 🎯 Sistema de Rifas Web

Sistema completo de gestión de rifas desarrollado con Node.js, Express, EJS y MySQL. Incluye autenticación basada en roles, dashboard en tiempo real con Socket.IO, charts interactivos y diseño responsive con Tailwind CSS.

## 🚀 Características

- **Autenticación por Roles**: Administrador, Supervisor y Vendedor
- **Dashboard en Tiempo Real**: Actualizaciones instantáneas con Socket.IO
- **Gráficos Interactivos**: Charts.js con datos en tiempo real de la base de datos
- **Diseño Responsive**: Interfaz moderna con Tailwind CSS y tema oscuro
- **Sistema de Notificaciones**: Alertas en tiempo real
- **Base de Datos MySQL**: Gestión completa de datos
- **Arquitectura Modular**: EJS layouts separados por roles

## 📋 Requisitos Previos

Antes de instalar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** (viene con Node.js)
- **MySQL** (versión 8.0 o superior)
- **Git** (para clonar el repositorio)

## 🛠️ Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/rifas-web.git
cd rifas-web
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

#### Crear la Base de Datos
```sql
CREATE DATABASE rifas;
USE rifas;
```

#### Crear Tabla de Usuarios
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('administrador', 'supervisor', 'vendedor') NOT NULL,
    avatar VARCHAR(255) DEFAULT '/admin/img/perfil/Logo.svg',
    branch_id INT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Crear Tabla de Estadísticas
```sql
CREATE TABLE estadisticas_consolidada_semanal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    utilidad_neta DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Insertar Usuario Administrador por Defecto
```sql
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@rifas.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador');
-- Contraseña por defecto: password
```

#### Insertar Datos de Ejemplo (Opcional)
```sql
INSERT INTO estadisticas_consolidada_semanal (fecha, utilidad_neta) VALUES
('2024-11-15', 1200.50),
('2024-11-16', 1400.75),
('2024-11-17', 1100.25),
('2024-11-18', 1600.00),
('2024-11-19', 1300.30),
('2024-11-20', 1800.90),
('2024-11-21', 1500.45),
('2024-11-22', 1700.80),
('2024-11-23', 1950.60);
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de la Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=rifas

# Configuración de Sesiones
SESSION_SECRET=tu_clave_secreta_muy_segura_aqui_cambiala_por_una_real
```

**⚠️ IMPORTANTE**: 
- Cambia `tu_usuario_mysql` por tu usuario de MySQL
- Cambia `tu_contraseña_mysql` por tu contraseña de MySQL  
- Cambia `tu_clave_secreta_muy_segura_aqui_cambiala_por_una_real` por una clave secreta única

### 5. Compilar CSS con Tailwind

```bash
npm run build-css
```

### 6. Iniciar el Servidor

#### Modo Desarrollo (con auto-recarga)
```bash
npm run dev
```

#### Modo Producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 👤 Acceso por Defecto

### Usuario Administrador
- **Email**: admin@rifas.com
- **Contraseña**: password

## 📁 Estructura del Proyecto

```
rifas-web/
├── 📁 config/
│   └── database.js          # Configuración de MySQL
├── 📁 middleware/
│   ├── auth.js              # Middleware de autenticación
│   └── flash.js             # Middleware de mensajes flash
├── 📁 models/
│   ├── User.js              # Modelo de usuarios
│   └── Estaditicas.js       # Modelo de estadísticas
├── 📁 routes/
│   ├── admin.js             # Rutas del administrador
│   ├── supervisor.js        # Rutas del supervisor
│   ├── vendedor.js          # Rutas del vendedor
│   └── general.js           # Rutas generales
├── 📁 socket/
│   └── sockets/             # Configuración de Socket.IO
├── 📁 views/
│   ├── 📁 layout/           # Layouts EJS
│   ├── 📁 pages/            # Páginas por rol
│   └── 📁 partials/         # Componentes reutilizables
├── 📁 public/
│   ├── 📁 js/               # JavaScript del frontend
│   ├── 📁 css/              # Estilos CSS
│   └── 📁 img/              # Imágenes
├── 📁 src/
│   ├── input.css            # CSS de entrada de Tailwind
│   └── output.css           # CSS compilado
└── app.js                   # Archivo principal del servidor
```

## 🎨 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL2** - Conector de base de datos
- **Socket.IO** - Comunicación en tiempo real
- **bcryptjs** - Encriptación de contraseñas
- **express-session** - Gestión de sesiones

### Frontend
- **EJS** - Motor de plantillas
- **Tailwind CSS** - Framework de CSS
- **Chart.js** - Gráficos interactivos
- **Font Awesome** - Iconos
- **Socket.IO Client** - Cliente de tiempo real

### Base de Datos
- **MySQL 8.0** - Sistema de gestión de base de datos

## 🔧 Scripts Disponibles

```bash
# Instalar dependencias
npm install

# Desarrollo con auto-recarga
npm run dev

# Producción
npm start

# Compilar CSS
npm run build-css

# Compilar CSS en modo watch
npm run watch-css
```

## 🚀 Despliegue

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=3000
DB_HOST=tu_host_produccion
DB_USER=tu_usuario_produccion
DB_PASSWORD=tu_contraseña_produccion
DB_NAME=rifas
SESSION_SECRET=clave_secreta_super_segura_para_produccion
```

### Compilación para Producción

```bash
npm install --production
npm run build-css
npm start
```

## 📱 Características por Rol

### 👑 Administrador
- Dashboard completo con estadísticas
- Gestión de usuarios
- Gráficos de utilidades semanales
- Acceso total al sistema
- Notificaciones en tiempo real

### 👥 Supervisor
- Dashboard de supervisión
- Reportes de ventas
- Gestión de vendedores
- Notificaciones de eventos

### 🛒 Vendedor
- Dashboard personal
- Gestión de sus ventas
- Historial de transacciones
- Metas personales

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Sesiones seguras con express-session
- Middleware de autenticación por roles
- Validación de datos en frontend y backend
- Protección contra inyecciones SQL

## 🐛 Solución de Problemas

### Error de Conexión a la Base de Datos
```bash
# Verificar que MySQL esté ejecutándose
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS
```

### Puerto ya en uso
```bash
# Cambiar el puerto en el archivo .env
PORT=3001
```

### CSS no se actualiza
```bash
# Recompilar Tailwind CSS
npm run build-css
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección de [Solución de Problemas](#-solución-de-problemas)
2. Abre un [Issue](https://github.com/tu-usuario/rifas-web/issues)
3. Contacta al equipo de desarrollo

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!** ⭐
