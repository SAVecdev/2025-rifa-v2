# 🚀 INSTRUCCIONES PARA SUBIR A GITHUB

## 📋 Paso 1: Crear Repositorio en GitHub

1. Ve a: https://github.com
2. Inicia sesión en tu cuenta
3. Haz clic en el botón verde "New" o en el "+" en la esquina superior derecha
4. Selecciona "New repository"
5. Configuración del repositorio:
   - **Repository name**: `rifas-web-system`
   - **Description**: `Sistema completo de gestión de rifas con Node.js, Express, EJS, MySQL, Socket.IO y Charts.js`
   - **Visibility**: Public (o Private si prefieres)
   - **NO marques** "Initialize this repository with a README"
   - **NO agregues** .gitignore ni license (ya los tenemos)
6. Haz clic en "Create repository"

## 📤 Paso 2: Conectar y Subir

Después de crear el repositorio, GitHub te mostrará una página con comandos. Copia la URL del repositorio y ejecuta estos comandos en PowerShell:

```bash
# Cambiar la rama principal a 'main' (estándar actual)
git branch -M main

# Conectar con tu repositorio remoto (REEMPLAZA TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/rifas-web-system.git

# Subir el código
git push -u origin main
```

**⚠️ IMPORTANTE**: Reemplaza `TU-USUARIO` por tu nombre de usuario real de GitHub.

## 🔗 URL Final

Después de subir, tu repositorio estará disponible en:
```
https://github.com/TU-USUARIO/rifas-web-system
```

## 📥 Para Descargar en Otra Máquina

Cualquier persona podrá clonar el proyecto con:
```bash
git clone https://github.com/TU-USUARIO/rifas-web-system.git
cd rifas-web-system
npm install
# Seguir instrucciones del README.md
```

## ✅ Estado Actual

✅ Git inicializado
✅ Archivos agregados (68 archivos)
✅ Commit inicial realizado
✅ Listo para push a GitHub

## 🎯 Próximos Pasos

1. Crear repositorio en GitHub
2. Ejecutar los comandos de conexión
3. ¡Listo para descargar en cualquier máquina!
