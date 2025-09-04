# 📦 Guía para Subir el Proyecto a GitHub

## 📋 Pasos Previos

### 1. Instalar Git (si no lo tienes)
- Descarga Git desde: https://git-scm.com/download/windows
- Instálalo con la configuración por defecto
- Reinicia la terminal/PowerShell después de la instalación

### 2. Configurar Git (primera vez)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@gmail.com"
```

## 🚀 Subir a GitHub

### 1. Crear Repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Inicia sesión en tu cuenta
3. Haz clic en el botón verde "New" o en el "+" en la esquina superior derecha
4. Selecciona "New repository"
5. Nombra el repositorio: `rifas-web`
6. Agrega descripción: `Sistema completo de gestión de rifas con Node.js, Express, EJS y MySQL`
7. Selecciona "Public" o "Private" según prefieras
8. **NO marques** "Initialize this repository with a README" (ya tenemos uno)
9. Haz clic en "Create repository"

### 2. Comandos para subir el proyecto

Abre PowerShell en la carpeta del proyecto (`E:\Rifas`) y ejecuta:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos (el .gitignore excluirá automáticamente .env)
git add .

# Hacer el primer commit
git commit -m "Initial commit: Sistema completo de rifas con Socket.IO, Charts.js y autenticación por roles"

# Conectar con el repositorio remoto (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/rifas-web.git

# Subir el código
git push -u origin main
```

**⚠️ IMPORTANTE**: Reemplaza `TU-USUARIO` por tu nombre de usuario de GitHub.

## 📂 Archivos que se subirán

✅ **Se incluyen:**
- Todo el código fuente
- README.md completo
- package.json con todas las dependencias
- .gitignore configurado
- .env.example (archivo de ejemplo)
- LICENSE (Licencia MIT)
- Toda la estructura de carpetas y archivos

❌ **Se excluyen automáticamente (.gitignore):**
- node_modules/
- .env (variables de entorno sensibles)
- Logs y archivos temporales
- Archivos del sistema operativo

## 🔄 Actualizaciones Futuras

Para subir cambios posteriores:

```bash
# Agregar cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir cambios
git push
```

## 🎯 Verificación

Después de subir, verifica que:

1. ✅ El repositorio esté visible en GitHub
2. ✅ El README.md se muestre correctamente
3. ✅ No aparezca el archivo .env (debe estar en .gitignore)
4. ✅ Todas las carpetas estén presentes
5. ✅ El archivo .env.example esté disponible

## 🔗 URL del Repositorio

Después de crear el repositorio, la URL será:
```
https://github.com/TU-USUARIO/rifas-web
```

Esta URL es la que otros podrán usar para clonar el proyecto:
```bash
git clone https://github.com/TU-USUARIO/rifas-web.git
```

## 🆘 Solución de Problemas

### Error: "git not found"
- Instala Git desde https://git-scm.com/download/windows
- Reinicia PowerShell después de la instalación

### Error: "repository not found"
- Verifica que hayas creado el repositorio en GitHub
- Verifica que el nombre de usuario en la URL sea correcto

### Error: "permission denied"
- Es posible que necesites autenticarte con GitHub
- Considera usar GitHub Desktop como alternativa visual

## 🎉 ¡Listo!

Una vez subido, cualquier persona podrá:
1. Clonar el repositorio
2. Seguir las instrucciones del README.md
3. Configurar su archivo .env
4. Ejecutar la aplicación

El README.md contiene todas las instrucciones detalladas para la instalación y configuración.
