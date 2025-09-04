# 🛠️ Guía de Desarrollo

## 🏗️ Arquitectura del Proyecto

### Patrón MVC Modificado
```
routes/ (Controllers) → models/ (Models) → views/ (Views)
                     ↓
                 middleware/ (Middleware)
                     ↓
                 socket/ (Real-time)
```

### Flujo de Autenticación
```
Login → auth.js → Session → Role-based Routes → Dashboard
```

## 📊 Base de Datos

### Esquema Principal
- **users**: Gestión de usuarios y roles
- **estadisticas_consolidada_semanal**: Datos para charts

### Conexión
- Pool de conexiones MySQL2
- Queries preparadas para seguridad
- Manejo de errores robusto

## 🔄 Socket.IO

### Eventos por Rol
- **Admin**: Gestión completa del sistema
- **Supervisor**: Supervisión de operaciones
- **Vendedor**: Eventos personales

### Estructura
```javascript
socket/
├── sockets/
│   ├── adminSockets.js
│   ├── supervisorSockets.js
│   └── vendedorSockets.js
└── index.js (configuración principal)
```

## 📈 Charts.js

### Implementación
- **Local**: Sin dependencias CDN
- **Datos Reales**: API endpoints con datos de BD
- **Responsive**: Adaptación automática
- **Loading States**: Estados de carga profesionales

### API Endpoint
```
GET /admin/api/estadisticas-mensuales
→ Retorna datos formateados para Chart.js
```

## 🎨 Frontend

### CSS Framework
- **Tailwind CSS**: Utilidades
- **Custom CSS**: Animaciones Socket.IO
- **Responsive**: Mobile-first

### JavaScript
- **Vanilla JS**: Sin frameworks pesados
- **Socket.IO Client**: Tiempo real
- **Chart.js**: Visualizaciones

## 🔐 Seguridad

### Autenticación
- bcryptjs para passwords
- express-session para sesiones
- Middleware de autorización por roles

### Validación
- Server-side validation
- Sanitización de inputs
- Protección CSRF (implementar si necesario)

## 🚀 Performance

### Optimizaciones
- Pool de conexiones DB
- Compresión de assets
- Cache de sesiones
- Lazy loading de charts

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

### Components
- Sidebar responsivo
- Charts adaptativos
- Navegación móvil

## 🔧 Scripts de Desarrollo

```bash
# Desarrollo completo
npm run dev

# CSS en modo watch
npm run watch-css

# Build de producción
npm run build-css
```

## 📦 Dependencias Clave

### Backend
- **express**: Framework web
- **mysql2**: Conector DB
- **socket.io**: Tiempo real
- **bcryptjs**: Encriptación
- **ejs**: Templates

### Frontend
- **tailwindcss**: CSS framework
- **chart.js**: Gráficos
- **socket.io-client**: Cliente tiempo real

## 🧪 Testing (Futuro)

### Recomendaciones
- **Jest**: Unit testing
- **Supertest**: API testing
- **Cypress**: E2E testing

## 📚 Extensiones Recomendadas

### VS Code
- EJS Language Support
- Tailwind CSS IntelliSense
- MySQL
- Node.js Extension Pack

## 🔄 Deployment

### Preparación
1. Variables de entorno de producción
2. Build de CSS optimizado
3. Configuración de DB de producción
4. SSL/HTTPS (recomendado)

### Plataformas Recomendadas
- **Heroku**: Fácil deployment
- **DigitalOcean**: VPS completo
- **Railway**: Moderno y simple
- **Vercel**: (necesita adaptación para BD)

## 🎯 Roadmap

### Próximas Características
- [ ] Sistema de notificaciones push
- [ ] Dashboard analytics avanzado
- [ ] API REST completa
- [ ] Testing automatizado
- [ ] PWA capabilities
- [ ] Multi-idioma

### Mejoras Técnicas
- [ ] Rate limiting
- [ ] Logs estructurados
- [ ] Monitoring
- [ ] Docker containerization
- [ ] CI/CD pipeline
