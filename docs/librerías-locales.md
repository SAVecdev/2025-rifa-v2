# Gestión de Librerías Locales

## Chart.js

Para mantener Chart.js actualizado sin depender de CDN:

### Actualizar Chart.js
```bash
npm update chart.js
npm run copy-libs
```

### Ubicación del archivo
- **Fuente**: `node_modules/chart.js/dist/chart.umd.min.js`
- **Destino**: `public/js/chart.min.js`
- **URL en la app**: `/js/chart.min.js`

### Configuración de archivos estáticos
El servidor está configurado para servir archivos desde:
1. `public/` (prioridad alta) - Para librerías de terceros
2. `src/` (compatibilidad) - Para archivos propios del proyecto

### Ventajas
- ✅ No depende de CDN externos
- ✅ Funciona sin conexión a internet
- ✅ Control total sobre la versión
- ✅ Mayor velocidad de carga
- ✅ No hay riesgo de que el CDN desaparezca
- ✅ Consistencia con otros archivos JS

### Comandos útiles
```bash
# Instalar Chart.js
npm install chart.js

# Copiar librerías a archivos estáticos
npm run copy-libs

# Verificar versión instalada
npm list chart.js
```

## Estructura de archivos JS

```
project/
├── public/js/          # Librerías de terceros (Chart.js, etc.)
│   ├── chart.min.js    # Chart.js local
│   └── main.js         # Scripts principales
└── src/js/             # Scripts propios del proyecto
    ├── main.js         # Scripts de aplicación
    └── socketClient.js # Cliente de Socket.IO
```

## Agregar nuevas librerías

Para agregar nuevas librerías siguiendo el mismo patrón:

1. Instalar la librería: `npm install libreria-name`
2. Copiar el archivo minificado a `public/js/`
3. Agregar el comando copy al script `copy-libs`
4. Incluir en el layout general: `<script src="/js/libreria.min.js"></script>`
