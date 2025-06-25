# CatalogoTienda
Sistema completo de catálogo de productos con autenticación, gestión de usuarios y administración

## 📋 Tabla de Contenidos
- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Configuración del Proyecto](#-configuración-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Gestión de Archivos](#-gestión-de-archivos)
- [Seguridad](#-seguridad)
- [Manual de Desarrollador](#-manual-de-desarrollador)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

## 🎯 Descripción del Proyecto

CatalogoTienda es una aplicación web completa de e-commerce que permite:
- **Usuarios**: Navegar productos, gestionar perfil, carrito de compras
- **Administradores**: Gestión completa de productos, usuarios y contenido del sitio
- **Autenticación**: Login tradicional y Google OAuth
- **Seguridad**: Rate limiting, cifrado de contraseñas, validación de IPs para admins

## ✨ Características

### Para Usuarios
- 🔐 Registro e inicio de sesión (tradicional + Google OAuth)
- 👤 Gestión de perfil con foto de avatar
- 🛒 Carrito de compras persistente
- 🔍 Búsqueda y filtrado de productos
- ⭐ Sistema de calificaciones y comentarios
- 💳 Gestión de métodos de pago
- 📦 Historial de compras

### Para Administradores
- 📊 Panel de administración completo
- 🏪 CRUD de productos con imágenes múltiples
- 👥 Gestión de usuarios y roles
- 📝 Gestión de contenido (Sobre Nosotros, Términos)
- 💰 Gestión de monedas y categorías
- 🌍 Gestión de ubicaciones geográficas
- 🔗 Gestión de redes sociales
- 🛡️ Control de IPs permitidas

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** con **Mongoose** - Base de datos NoSQL
- **Passport.js** - Autenticación
- **Bcrypt** - Cifrado de contraseñas
- **Multer** - Carga de archivos
- **Helmet** - Headers de seguridad
- **Express Rate Limit** - Limitación de requests
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5, CSS3, JavaScript** - Frontend vanilla
- **SweetAlert2** - Alertas y notificaciones
- **Responsive Design** - Diseño adaptativo

### Autenticación
- **Google OAuth 2.0** - Login con Google
- **Session Management** - Manejo de sesiones
- **JWT-like sessions** - Autenticación persistente

## 🚀 Configuración del Proyecto

### Prerrequisitos
- **Node.js** (v14 o superior)
- **MongoDB** (local o Atlas)
- **Cuenta de Google Cloud** (para OAuth)
- **Git**

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/CatalogoTienda.git
   cd CatalogoTienda
   ```

2. **Instalar dependencias**
   ```bash
   cd backend
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env` con tus credenciales reales:
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=tu_client_secret
   GOOGLE_CALLBACK_URL=/auth/google/callback
   
   # MongoDB
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database
   
   # Servidor
   PORT=3000
   SESSION_SECRET=tu_session_secret_muy_seguro
   ```

4. **Configurar Google OAuth**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto
   - Habilita la API de Google+
   - Crea credenciales OAuth 2.0
   - Configura las URLs autorizadas:
     - **Origen**: `http://localhost:3000`
     - **Redirect URI**: `http://localhost:3000/auth/google/callback`

5. **Ejecutar el proyecto**
   ```bash
   npm start
   ```
   
   El servidor se ejecutará en `http://localhost:3000`

## � Estructura del Proyecto

```
CatalogoTienda/
├── backend/
│   ├── models/           # Modelos de MongoDB
│   │   ├── perfil.js    # Modelo de usuarios
│   │   ├── productos.js # Modelo de productos
│   │   ├── mensajes.js  # Modelo de mensajes/contacto
│   │   └── ...
│   ├── public/          # Archivos estáticos
│   │   ├── css/        # Estilos
│   │   ├── js/         # JavaScript del frontend
│   │   ├── img/        # Imágenes y avatares
│   │   └── productos/  # Imágenes de productos
│   ├── data/           # Archivos de configuración JSON
│   ├── routes/         # Rutas de la API
│   ├── .env.example   # Plantilla de variables de entorno
│   ├── server.js      # Servidor principal
│   └── package.json   # Dependencias
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Autenticación
```http
POST /api/crear-cuenta         # Crear cuenta nueva
POST /api/iniciar-sesion       # Iniciar sesión tradicional
GET  /auth/google              # Iniciar OAuth con Google
GET  /auth/google/callback     # Callback de Google OAuth
GET  /api/auth/user            # Obtener usuario autenticado
```

### Productos
```http
GET    /api/productos          # Obtener todos los productos
GET    /api/productos/:id      # Obtener producto por ID
POST   /api/productos          # Crear nuevo producto (Admin)
PUT    /api/productos/:id      # Actualizar producto (Admin)
DELETE /api/productos/:id      # Eliminar producto (Admin)
PATCH  /api/productos/:id/disponibilidad  # Cambiar estado
```

### Usuarios y Perfil
```http
GET  /api/perfil               # Obtener perfil del usuario
PUT  /api/perfil               # Actualizar perfil
POST /api/perfil/foto          # Subir foto de perfil
GET  /api/usuarios             # Obtener todos los usuarios (Admin)
PUT  /api/usuarios/:correo/rol # Cambiar rol de usuario (Admin)
```

### Carrito y Compras
```http
GET    /api/usuarios/:correo/carrito    # Obtener carrito
PUT    /api/usuarios/:correo/carrito    # Actualizar carrito
DELETE /api/usuarios/:correo/carrito/:id # Eliminar del carrito
POST   /api/usuarios/:correo/compras    # Registrar compra
POST   /api/pagar                       # Procesar pago
```

### Administración
```http
GET    /api/sobre-nosotros     # Gestión de equipo
POST   /api/sobre-nosotros     # Crear/actualizar miembro
DELETE /api/sobre-nosotros/:id # Eliminar miembro

GET    /api/terminos-condiciones  # Términos y condiciones
POST   /api/terminos-condiciones  # Crear/actualizar término

GET    /api/monedas            # Gestión de monedas
POST   /api/monedas            # Crear moneda
PUT    /api/monedas/:id        # Actualizar moneda
DELETE /api/monedas/:id        # Eliminar moneda

GET    /api/categorias         # Gestión de categorías
POST   /api/categorias         # Crear categoría
PUT    /api/categorias/:id     # Actualizar categoría
DELETE /api/categorias/:id     # Eliminar categoría
```

## 🔐 Sistema de Autenticación

### Autenticación Tradicional
1. **Registro**: Email + contraseña con validaciones de seguridad
2. **Login**: Verificación con bcrypt + rate limiting
3. **Sesiones**: Manejo persistente con express-session

### Google OAuth
1. **Integración**: Passport.js con Google Strategy
2. **Datos**: Descarga automática de avatar de Google
3. **Sincronización**: Merge de cuentas existentes

### Seguridad
- **Rate Limiting**: 5 intentos de login por 15 minutos
- **Cifrado**: Bcrypt con 12 rondas de salt
- **Validación IP**: Solo IPs registradas para admins
- **Reset automático**: Contador de rate limit tras login exitoso

## 📁 Gestión de Archivos

### Configuración Multer
```javascript
// Productos: /productos/
// Perfiles: /img/perfiles/
// Equipo: /img/
```

### Tipos de archivo
- **Imágenes**: JPG, PNG, WEBP
- **Límites**: 5MB por archivo
- **Múltiples**: Hasta 10 imágenes por producto

### Eliminación automática
- Al eliminar producto → se borran sus imágenes
- Al cambiar avatar → se borra imagen anterior
- Validación de existencia antes de eliminar

## 🛡 Seguridad

### Headers de Seguridad (Helmet)
```javascript
// CSP configurado para recursos necesarios
// CORS habilitado con credenciales
// Protección XSS y clickjacking
```

### Rate Limiting
- **General**: Removido para mejor UX
- **Login**: 5 intentos por IP cada 15 minutos
- **Reset**: Automático tras login exitoso

### Validaciones
- **Backend**: Validación completa de datos
- **Frontend**: Validación en tiempo real
- **Sanitización**: Limpieza de inputs

## 👨‍💻 Manual de Desarrollador

### Agregar Nueva Funcionalidad

1. **Crear modelo** (si necesita base de datos)
   ```javascript
   // backend/models/nuevoModelo.js
   const mongoose = require('mongoose');
   
   const nuevoSchema = new mongoose.Schema({
     campo: { type: String, required: true }
   });
   
   module.exports = mongoose.model('NuevoModelo', nuevoSchema);
   ```

2. **Agregar endpoints**
   ```javascript
   // En server.js o routes/
   app.get('/api/nuevo-endpoint', async (req, res) => {
     try {
       // Lógica aquí
       res.json({ success: true });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

3. **Frontend JavaScript**
   ```javascript
   // backend/public/js/nuevoArchivo.js
   async function nuevaFuncion() {
     try {
       const response = await fetch('/api/nuevo-endpoint');
       const data = await response.json();
       // Manejar respuesta
     } catch (error) {
       console.error('Error:', error);
     }
   }
   ```

### Convenciones de Código

#### Backend
- **Async/await** para operaciones asíncronas
- **Try/catch** en todos los endpoints
- **Validación** de parámetros obligatorios
- **Status codes** apropiados (200, 201, 400, 404, 500)
- **Logging** de errores con console.error

#### Frontend
- **Fetch API** para requests
- **SweetAlert2** para notificaciones
- **Event listeners** en DOMContentLoaded
- **Validación** en tiempo real
- **Feedback visual** para el usuario

#### Base de Datos
- **Mongoose schemas** con validaciones
- **Indexes** para campos de búsqueda
- **Cascade operations** para eliminaciones
- **Atomic operations** para updates

### Debugging

1. **Logs del servidor**
   ```bash
   # Ejecutar con logs detallados
   DEBUG=* npm start
   ```

2. **Verificar conexión DB**
   ```javascript
   mongoose.connection.on('connected', () => {
     console.log('MongoDB conectado');
   });
   ```

3. **Verificar variables de entorno**
   ```javascript
   console.log('Puerto:', process.env.PORT);
   console.log('MongoDB:', process.env.MONGODB_URI ? 'Configurado' : 'No configurado');
   ```

### Testing

#### Test manual de endpoints
```bash
# Productos
curl -X GET http://localhost:3000/api/productos

# Login
curl -X POST http://localhost:3000/api/iniciar-sesion \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@test.com","contrasena":"password"}'
```

#### Verificar autenticación
1. Login en frontend
2. Verificar localStorage con DevTools
3. Probar endpoints protegidos

### Problemas Comunes

#### Error de CORS
```javascript
// Verificar configuración en server.js
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
```

#### Error de rate limiting
```javascript
// Verificar IP y reset manual si es necesario
authLimiter.store.resetKey(req.ip);
```

#### Problemas de uploads
```javascript
// Verificar permisos de carpetas
// Verificar límites de multer
// Verificar tipos de archivo permitidos
```

## 🚀 Despliegue

### Variables de Entorno Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod-user:pass@cluster.mongodb.net/prod-db
GOOGLE_CLIENT_ID=prod_client_id
GOOGLE_CLIENT_SECRET=prod_client_secret
GOOGLE_CALLBACK_URL=https://tu-dominio.com/auth/google/callback
SESSION_SECRET=super_secure_random_string
PORT=443
```

### Consideraciones de Producción
- **HTTPS**: Obligatorio para Google OAuth
- **PM2**: Para gestión de procesos
- **Nginx**: Como reverse proxy
- **MongoDB Atlas**: Base de datos en la nube
- **Cloudinary**: Para gestión de imágenes (opcional)

### Scripts de Despliegue
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"No tests specified\"",
    "prod": "NODE_ENV=production node server.js"
  }
}
```

## 🤝 Contribución

### Proceso de Contribución
1. **Fork** del repositorio
2. **Crear rama** para la feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Pull Request** con descripción detallada

### Estándares de Código
- **ESLint**: Seguir configuración del proyecto
- **Comentarios**: Documentar funciones complejas
- **Naming**: Variables y funciones en español
- **Commits**: Mensajes descriptivos en español

### Reportar Bugs
1. **Issue** en GitHub con:
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots (si aplica)
   - Información del entorno

---

## 📝 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 📞 Contacto
- **Desarrollador**: Anderson
- **Email**: [andorpapi@gmail.com]
- **GitHub**: [NebeDragon]

---

**¡Gracias por contribuir al proyecto CatalogoTienda! 🛍️**