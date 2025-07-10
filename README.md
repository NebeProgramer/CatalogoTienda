# 🛠️ PawMarket - Manual de Desarrollador (v1.0.0)

## Descripción General
Sistema integral de e-commerce con autenticación avanzada, gestión de usuarios, panel de administración, sistema de temas dinámicos, notificaciones inteligentes y personalización total.

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Dependencias y Scripts](#dependencias-y-scripts)
- [Modelos y Rutas](#modelos-y-rutas)
- [API Endpoints](#api-endpoints)
- [Sistema de Temas](#sistema-de-temas)
- [Notificaciones](#notificaciones)
- [Personalización de Correos](#personalización-de-correos)
- [Despliegue y Producción](#despliegue-y-producción)
- [Convenciones y Buenas Prácticas](#convenciones-y-buenas-prácticas)
- [Debugging y Testing](#debugging-y-testing)
- [Problemas Comunes](#problemas-comunes)
- [Licencia y Contacto](#licencia-y-contacto)

---

## Estructura del Proyecto
```
CatalogoTienda/
├── backend/
│   ├── models/           # Modelos de MongoDB
│   ├── routes/           # Rutas de la API
│   ├── public/           # Frontend estático (html, css, js, img)
│   ├── data/             # Archivos de configuración JSON
│   ├── server.js         # Servidor principal
│   ├── package.json      # Dependencias backend
│   └── ...
├── MANUAL_USUARIO.md     # Manual para usuarios finales
├── README.md             # Manual de desarrollador (este archivo)
├── package.json          # Dependencias raíz
└── ...
```

## Instalación y Configuración
1. Clona el repositorio y entra al proyecto:
   ```bash
   git clone https://github.com/tu-usuario/CatalogoTienda.git
   cd CatalogoTienda
   ```
2. Instala dependencias:
   ```bash
   cd backend
   npm install
   ```
3. Configura variables de entorno:
   - Copia `.env.example` a `.env` y edítalo con tus credenciales:
   ```env
   MONGODB_URI=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   EMAIL_USER=...
   EMAIL_PASS=...
   PORT=3000
   SESSION_SECRET=...
   JWT_SECRET=...
   ```
4. Inicializa datos base (opcional):
   ```bash
   node init-idiomas.js
   ```
5. Ejecuta el proyecto:
   ```bash
   npm start
   # o para desarrollo
   npm run dev
   ```

## Dependencias y Scripts
- Node.js 18+, MongoDB Atlas, Express, Mongoose, Passport, Bcrypt, Multer, Helmet, SweetAlert2, etc.
- Scripts principales en `package.json`:
  - `start`, `dev`, `test`, `prod`

## Modelos y Rutas
- Modelos en `backend/models/` (productos, usuarios, temas, monedas, etc.)
- Rutas en `backend/routes/`
- Datos iniciales en `backend/data/`

## API Endpoints
- Autenticación: `/api/crear-cuenta`, `/api/iniciar-sesion`, `/auth/google`, `/api/auth/user`
- Productos: `/api/productos`, `/api/productos/:id`, `/api/productos` (POST, PUT, DELETE)
- Usuarios y perfil: `/api/perfil`, `/api/usuarios`, `/api/usuarios/:correo/rol`
- Carrito y compras: `/api/usuarios/:correo/carrito`, `/api/pagar`, `/api/usuarios/:correo/compras`
- Administración: `/api/sobre-nosotros`, `/api/terminos-condiciones`, `/api/monedas`, `/api/categorias`, `/api/ubicaciones`, `/api/redes-sociales`, `/api/ips`, `/api/mensajes`
- Sistema de Temas: `/api/temas`, `/api/temas/:id`

## Sistema de Temas
- Editor visual completo (sliders RGB, input HEX, canal alpha)
- 16 variables CSS personalizables
- Aplicación automática en todas las páginas
- Persistencia local por usuario (localStorage)
- SweetAlert2 integrado y tematizado
- Archivos clave: `editor-temas.js`, `tema-global.js`, `sweetalert-tema.js`, `temasManager.js`, `Tema.js`, `style.css`

## Notificaciones
- Toast notifications (éxito, error, advertencia, info)
- Modales de confirmación
- Integración total con el sistema de temas
- SweetAlert2 optimizado

## Personalización de Correos
- Correos tematizados según el tema activo
- Tipos: verificación, recuperación, confirmación de compra, contacto
- Branding consistente y responsive

## Despliegue y Producción
- HTTPS obligatorio, Nginx como reverse proxy, PM2 para procesos
- MongoDB Atlas, Cloudflare opcional
- Variables de entorno seguras
- Scripts de despliegue en `package.json`

## Convenciones y Buenas Prácticas
- Backend: async/await, try/catch, validación de parámetros, status codes, logging
- Frontend: Fetch API, SweetAlert2, validación en tiempo real, feedback visual
- Base de datos: Mongoose schemas, indexes, operaciones atómicas

## Debugging y Testing
- Logs detallados con `DEBUG=* npm start`
- Verificar conexión DB y variables de entorno
- Test manual de endpoints con curl
- Revisar localStorage y DevTools

## Problemas Comunes
| Problema | Síntoma | Solución |
|----------|---------|----------|
| Temas no se aplican | Variables CSS no cambian | Verificar carga de `tema-global.js` |
| SweetAlert sin tema | Notificaciones por defecto | Verificar `sweetalert-tema.js` |
| Editor no abre | Click en "Editar" no responde | Verificar `editor-temas.js` |
| Tema no persiste | Se pierde al recargar | Verificar localStorage |
| Google OAuth falla | Error de redirect URI | Revisar Google Cloud |

## Licencia y Contacto
- Licencia MIT
- Desarrollador: Anderson
- Email: soporte@catalogotienda.com
- WhatsApp: +1 (555) 123-4567
- Centro de ayuda: www.catalogotienda.com/ayuda

---

*Última actualización: Julio 2025*
