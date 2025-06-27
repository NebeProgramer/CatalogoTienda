# riables de entorno en .env🛍️ CatalogoTienda - Sistema de E-commerce Completo

Sistema integral de catálogo de productos con autenticación avanzada, gestión de usuarios, panel de administración, sistema de temas dinámicos y notificaciones inteligentes.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Sistema de Temas Dinámicos](#-sistema-de-temas-dinámicos)
- [Sistema de Notificaciones Inteligentes](#-sistema-de-notificaciones-inteligentes)
- [Personalización de Correos](#-personalización-de-correos)
- [Configuración del Proyecto](#-configuración-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Manual de Desarrollo](#-manual-de-desarrollo)
- [Despliegue](#-despliegue)

## 🎯 Descripción del Proyecto

CatalogoTienda es una plataforma completa de e-commerce construida con Node.js y MongoDB que ofrece:

### 👥 **Para Usuarios**

- Navegación y búsqueda de productos
- Sistema de carrito y compras
- Gestión de perfil con avatares
- Múltiples métodos de pago
- Historial de compras detallado

### 🔧 **Para Administradores**

- Panel de administración completo
- Editor visual de temas y colores
- Gestión CRUD de productos, usuarios y contenido
- Sistema de monedas y ubicaciones
- Control de acceso por IP

## ✨ Características Principales

### 🔐 **Autenticación Avanzada**

- ✅ Registro e inicio de sesión tradicional
- ✅ Google OAuth 2.0 integrado
- ✅ Verificación por correo electrónico
- ✅ Recuperación de contraseñas segura
- ✅ Validación de IPs para administradores

### 🎨 **Sistema de Temas Dinámicos**

- ✅ Editor visual de colores en tiempo real
- ✅ Creación y gestión de temas personalizados
- ✅ Aplicación automática en todas las páginas
- ✅ Persistencia global mediante localStorage
- ✅ Preview inmediato de cambios
- ✅ Correos electrónicos tematizados automáticamente

### 🔔 **Sistema de Notificaciones Inteligentes**

- ✅ Toast notifications no intrusivas (esquina superior derecha)
- ✅ Modales de confirmación para acciones críticas
- ✅ Notificaciones tipificadas (éxito, error, advertencia, info)
- ✅ Timer automático para toast (3 segundos)
- ✅ Integración completa con el sistema de temas
- ✅ SweetAlert2 optimizado para UX

### 🛒 **E-commerce Completo**

- ✅ Catálogo con imágenes múltiples
- ✅ Sistema de categorías y filtros
- ✅ Carrito persistente entre sesiones
- ✅ Gestión de stock automática
- ✅ Múltiples monedas con conversión

### 🌍 **Internacionalización**

- ✅ Soporte para múltiples monedas
- ✅ Gestión de ubicaciones geográficas
- ✅ Mapas integrados (Leaflet)
- ✅ Redes sociales configurables

## 🛠 Tecnologías Utilizadas

### **Backend**

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js** - Runtime de JavaScript
- ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) **Express.js** - Framework web
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB** - Base de datos NoSQL
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white) **JSON Web Tokens** - Autenticación

### **Frontend**

- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5** - Estructura
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3** - Estilos con variables CSS
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript ES6+** - Lógica del cliente
- ![SweetAlert2](https://img.shields.io/badge/SweetAlert2-ff6b6b?style=flat) **SweetAlert2** - Notificaciones

### **Servicios Externos**

- ![Google](https://img.shields.io/badge/Google_OAuth-4285F4?style=flat&logo=google&logoColor=white) **Google OAuth 2.0** - Autenticación social
- ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white) **Leaflet** - Mapas interactivos

## 🔔 Sistema de Notificaciones Inteligentes

### **Arquitectura de Notificaciones**

El sistema implementa una estrategia inteligente de notificaciones que mejora significativamente la experiencia del usuario:

#### 🎯 **Toast Notifications (Por Defecto)**

- **Ubicación**: Esquina superior derecha
- **Duración**: 3 segundos automático
- **Comportamiento**: No bloquean la interacción del usuario
- **Uso**: Para feedback inmediato y no crítico

```javascript
// Ejemplo de toast automático
Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Producto agregado al carrito',
    showConfirmButton: false,
    timer: 3000
});
```

#### 🚨 **Modales de Confirmación (Casos Específicos)**

- **Cuándo**: Acciones irreversibles o críticas
- **Ejemplos**: Eliminar productos, agregar IPs administrativas, confirmaciones de pago
- **Comportamiento**: Requieren interacción explícita del usuario

```javascript
// Modal de confirmación crítica
const result = await Swal.fire({
    title: '¿Eliminar producto?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
});
```

#### 📝 **Criterios de Clasificación**

- **Toast**: Éxito, información, errores menores, feedback de acciones
- **Modal**: Confirmaciones con `.then()`, `showCancelButton`, `input`, acciones de seguridad

### **Integración con Temas**

- Las notificaciones se adaptan automáticamente al tema activo
- Colores dinámicos según las variables CSS del tema
- Consistencia visual en toda la aplicación

## 📧 Personalización de Correos

### **Sistema de Correos Tematizados**

Los correos electrónicos del sistema se adaptan automáticamente al tema visual activo:

#### ✉️ **Tipos de Correo Soportados**

- **Verificación de cuenta**: Email de confirmación de registro
- **Recuperación de contraseña**: Reset de password
- **Notificaciones de compra**: Confirmaciones de pedidos
- **Contacto**: Respuestas automáticas

#### 🎨 **Características de Personalización**

- **Colores dinámicos**: Usa los colores del tema activo
- **Branding consistente**: Logo y colores corporativos
- **Responsive design**: Optimizado para todos los dispositivos
- **Variables CSS**: Sistema de variables para fácil mantenimiento

#### 🔧 **Implementación Técnica**

```javascript
// Función para obtener tema activo (backend)
async function obtenerTemaActivo() {
    try {
        const tema = await Tema.findOne({ activo: true });
        return tema ? tema.colores : null;
    } catch (error) {
        console.error('Error al obtener tema activo:', error);
        return null;
    }
}

// Aplicación en correos
const coloresTema = await obtenerTemaActivo();
const htmlCorreo = generarHTMLCorreo(datos, coloresTema);
```

## 🎨 Sistema de Temas Dinámicos

### **Arquitectura del Sistema**

```
┌─────────────────────────────────────────────┐
│                Frontend                     │
│   index.html    │     indexAdmin.html       │
│ (Preferencias)  │   (Editor de Temas)       │
├─────────────────┼───────────────────────────┤
│   script.js     │    editor-temas.js        │
│ (Modal Prefs)   │  (Editor Visual)          │
├─────────────────┼───────────────────────────┤
│         tema-global.js (Universal)          │
│      (Aplicación automática en todas       │
│           las páginas)                      │
├─────────────────┼───────────────────────────┤
│      sweetalert-tema.js (Nuevo)             │
│  (SweetAlert2 con temas dinámicos)          │
├─────────────────┴───────────────────────────┤
│             localStorage                    │
│  - temaSeleccionado (ID)                   │
│  - nombreTemaSeleccionado                  │
│  - coloresTema (JSON)                      │
│  - iconicoTema                             │
└─────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────┐
│                Backend                      │
├─────────────────────────────────────────────┤
│            MongoDB Atlas                    │
│         Colección: temas                    │
│                                             │
│  {                                          │
│    _id: ObjectId,                           │
│    nombre: "Tema Oscuro",                   │
│    icono: "🌙",                             │
│    colores: {                               │
│      bgPrimary: "#1a1a1a",                  │
│      textPrimary: "#ffffff",                │
│      success: "#4caf50",                    │
│      error: "#f44336",                      │
│      warning: "#ff9800",                    │
│      info: "#2196f3",                       │
│      ...                                    │
│    },                                       │
│    activo: boolean                          │
│  }                                          │
└─────────────────────────────────────────────┘
```

### **Características Principales**

#### 🎨 **Editor Visual de Temas**

- ✅ Editor de colores RGB con sliders interactivos
- ✅ Input hexadecimal para colores precisos
- ✅ Canal Alpha para transparencias
- ✅ Previsualización en tiempo real
- ✅ Aplicación inmediata de cambios

#### 🎯 **Sistema de Variables CSS**

- ✅ 16 variables CSS personalizables:
  - `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
  - `--text-primary`, `--text-secondary`, `--text-accent`
  - `--border-primary`, `--border-secondary`
  - `--shadow-light`, `--shadow-medium`
  - `--success`, `--warning`, `--error`, `--info`
  - `--modal-bg`, `--hover-overlay`

#### 🔄 **Sincronización Automática**

- ✅ Persistencia en localStorage
- ✅ Aplicación automática al cargar páginas
- ✅ Sincronización entre pestañas del navegador
- ✅ Eventos personalizados para comunicación entre componentes

#### 🎭 **SweetAlert2 Integrado**

- ✅ **Configuración automática** con variables CSS del tema
- ✅ **4 mixins personalizados**:
  - `SwalToast` - Notificaciones toast
  - `SwalConfirm` - Modales de confirmación
  - `SwalAlert` - Alertas simples
  - `SwalSuccess/Error/Warning` - Alertas tipificadas
- ✅ **Actualización automática** al cambiar tema
- ✅ **Funciones de utilidad** globales

### **Flujo de Funcionamiento**

#### 1. **Creación de Temas** (Admin):

```javascript
// En indexAdmin.html - Editor visual
EditorTemas.crearNuevoTema() → 
API POST /api/temas → 
MongoDB → 
Renderización inmediata → 
Editor visual abierto
```

#### 2. **Edición de Temas** (Admin):

```javascript
// Editor visual con sliders RGB
EditorTemas.editarTema(id) →
Sliders RGB + Input HEX →
Previsualización en vivo →
Guardado en MongoDB →
Aplicación inmediata
```

#### 3. **Aplicación de Temas** (Usuario/Admin):

```javascript
// Aplicar tema seleccionado
EditorTemas.aplicarTema(id) →
Variables CSS actualizadas →
localStorage sincronizado →
SweetAlert2 reconfigurado →
Evento 'temaAplicado' emitido
```

#### 4. **Carga Automática** (Todas las páginas):

```javascript
// Al cargar cualquier página
tema-global.js ejecutado →
localStorage consultado →
Variables CSS aplicadas →
sweetalert-tema.js configurado →
Tema listo para usar
```

### **Configuración de SweetAlert2**

#### **Mixins Disponibles**:

```javascript
// Toast notifications (esquina superior derecha)
window.SwalToast.fire({
    icon: 'success',
    title: 'Operación exitosa',
    text: 'Los datos se guardaron correctamente'
});

// Modal de confirmación
const resultado = await window.SwalConfirm.fire({
    title: '¿Eliminar elemento?',
    text: 'Esta acción no se puede deshacer'
});

// Alerta simple
window.SwalAlert.fire({
    icon: 'info',
    title: 'Información',
    text: 'Datos actualizados correctamente'
});
```

#### **Funciones de Utilidad**:

```javascript
// Toast rápido
mostrarToast('success', 'Guardado exitoso');

// Confirmación rápida
const confirmado = await mostrarConfirmacion(
    '¿Continuar?', 
    'Se aplicarán los cambios'
);

// Alerta rápida
mostrarAlerta('error', 'Error', 'No se pudo conectar al servidor');
```

### **Archivos del Sistema**

| Archivo                | Propósito                              | Ubicación                 |
| ---------------------- | --------------------------------------- | -------------------------- |
| `editor-temas.js`    | Editor visual de temas (Admin)          | `/js/editor-temas.js`    |
| `tema-global.js`     | Aplicación automática (Universal)     | `/js/tema-global.js`     |
| `sweetalert-tema.js` | **[NUEVO]** SweetAlert2 con temas | `/js/sweetalert-tema.js` |
| `style.css`          | Variables CSS y estilos SweetAlert2     | `/css/style.css`         |

### **Variables CSS Personalizables**

```css
:root {
    /* Fondos */
    --bg-primary: #ffffff;      /* Fondo principal */
    --bg-secondary: #f8f9fa;    /* Fondo secundario */
    --bg-tertiary: #e9ecef;     /* Fondo terciario */
  
    /* Textos */
    --text-primary: #212529;    /* Texto principal */
    --text-secondary: #6c757d;  /* Texto secundario */
    --text-accent: #007bff;     /* Texto de acento */
  
    /* Bordes */
    --border-primary: #dee2e6;  /* Borde principal */
    --border-secondary: #ced4da; /* Borde secundario */
  
    /* Sombras */
    --shadow-light: rgba(0,0,0,0.1);  /* Sombra suave */
    --shadow-medium: rgba(0,0,0,0.2); /* Sombra media */
  
    /* Estados */
    --success: #28a745;         /* Color de éxito */
    --warning: #ffc107;         /* Color de advertencia */
    --error: #dc3545;           /* Color de error */
    --info: #17a2b8;            /* Color de información */
  
    /* Especiales */
    --modal-bg: rgba(0,0,0,0.5); /* Fondo de modales */
    --hover-overlay: rgba(0,0,0,0.05); /* Overlay hover */
}
```

## 🚀 Configuración del Proyecto

### **Prerequisitos**

- Node.js 16+
- MongoDB Atlas o local
- Cuenta de Google Cloud (para OAuth)

### **Instalación**

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/CatalogoTienda.git
   cd CatalogoTienda
   ```
2. **Instalar dependencias**

   ```bash
   npm install
   cd backend
   npm install
   ```
3. **Configurar variables de entorno**

   ```bash
   # backend/.env (usar valores propios)
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/catalogo
   JWT_SECRET=generar_clave_secreta_segura_unica
   GOOGLE_CLIENT_ID=tu_google_client_id.googleusercontent.com
   GOOGLE_CLIENT_SECRET=tu_google_client_secret
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_app_password_gmail
   PORT=3000
   ```

   > ⚠️ **Importante**: Nunca commitear el archivo `.env` con credenciales reales. Usar siempre variables de entorno seguras en producción.
   >
4. **Inicializar la base de datos**

   ```bash
   node init-idiomas.js  # Crear monedas y ubicaciones iniciales
   ```
5. **Ejecutar el proyecto**

   ```bash
   npm start
   # o para desarrollo:
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
CatalogoTienda/
├── backend/
│   ├── models/           # Modelos de MongoDB
│   │   ├── productos.js
│   │   ├── perfil.js
│   │   ├── categoria.js
│   │   └── ...
│   ├── routes/           # Rutas de la API
│   │   └── routes.js
│   ├── public/           # Frontend estático
│   │   ├── index.html    # Página principal
│   │   ├── indexAdmin.html # Panel admin
│   │   ├── css/
│   │   │   ├── style.css      # Estilos principales
│   │   │   └── editor-temas.css # Estilos del editor
│   │   ├── js/
│   │   │   ├── script.js      # Lógica principal
│   │   │   ├── editor-temas.js # Editor de temas
│   │   │   ├── tema-global.js  # Sistema global
│   │   │   └── ...
│   │   └── img/          # Imágenes estáticas
│   ├── data/             # Datos iniciales
│   ├── server.js         # Servidor principal
│   ├── init-idiomas.js   # Script inicialización
│   └── package.json
├── README.md
└── package.json
```

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
   
   # Email (para envío de correos tematizados)
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_app_password_gmail
   
   # Servidor
   PORT=3000
   SESSION_SECRET=generar_session_secret_muy_seguro
   JWT_SECRET=generar_jwt_secret_seguro
   ```

   > ⚠️ **Seguridad**: Nunca commitear archivos `.env` con credenciales reales. Usar variables de entorno del sistema en producción.
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
MONGODB_URI=mongodb+srv://prod-user:secure-pass@cluster.mongodb.net/prod-db
GOOGLE_CLIENT_ID=prod_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=prod_client_secret
GOOGLE_CALLBACK_URL=https://tu-dominio.com/auth/google/callback
EMAIL_USER=noreply@tu-dominio.com
EMAIL_PASS=secure_app_password
SESSION_SECRET=generar_clave_super_segura_produccion
JWT_SECRET=generar_jwt_secret_seguro_produccion
PORT=443
```

> 🔒 **Importante**: En producción, usar variables de entorno del sistema operativo, no archivos `.env`

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

## 📊 Changelog y Actualizaciones Recientes

### 🆕 **Versión 3.0** - Sistema de Notificaciones Inteligentes (Diciembre 2024)

#### ✨ **Nuevas Funcionalidades**
- **Sistema de Toast Inteligente**: Migración masiva de más de 200 notificaciones a toast no intrusivos
- **Criterios de Clasificación**: Toast automáticos vs modales de confirmación según contexto
- **Timer Automático**: 3 segundos para toast, manual para confirmaciones críticas
- **UX Mejorada**: Notificaciones en esquina superior derecha sin bloquear interacción

#### 🎨 **Correos Tematizados** 
- **Personalización Automática**: Correos que se adaptan al tema visual activo
- **Tipos Soportados**: Verificación, recuperación de contraseña, confirmaciones de compra
- **Colores Dinámicos**: Variables CSS aplicadas a templates de email
- **Branding Consistente**: Coherencia visual entre app y comunicaciones

#### 🔧 **Mejoras Técnicas**
- **Función `obtenerTemaActivo()`**: Centralización de lógica de temas en backend
- **Variables CSS Expandidas**: 16 variables para personalización completa
- **SweetAlert2 Optimizado**: Configuración automática con temas dinámicos
- **Estandarización**: Corrección de casos inconsistentes de `swal.fire`

### 🛠 **Versión 2.5** - Sistema de Temas Dinámicos (Noviembre 2024)

#### 🎨 **Editor Visual de Temas**
- **Editor RGB Avanzado**: Sliders, input hexadecimal y canal alpha
- **16 Variables CSS**: Control total sobre colores de la aplicación
- **Previsualización en Tiempo Real**: Cambios inmediatos sin recarga
- **Persistencia Global**: localStorage + sincronización entre pestañas

#### 🌍 **Aplicación Universal**
- **Auto-aplicación**: Tema activo se aplica automáticamente en todas las páginas
- **Comunicación Entre Componentes**: Eventos personalizados para sincronización
- **Retrocompatibilidad**: Temas antiguos siguen funcionando correctamente

### 🔐 **Versión 2.0** - Sistema de Autenticación Avanzado (Octubre 2024)

#### 🛡 **Seguridad Mejorada**
- **Google OAuth 2.0**: Integración completa con descarga de avatares
- **Rate Limiting Inteligente**: Protección contra ataques de fuerza bruta
- **Validación de IPs**: Control de acceso administrativo por ubicación
- **Cifrado Avanzado**: Bcrypt con 12 rondas para contraseñas

#### 📧 **Sistema de Correo**
- **Verificación de Email**: Confirmación obligatoria para nuevos usuarios
- **Recuperación Segura**: Reset de contraseñas con tokens temporales
- **Templates Responsive**: Diseño adaptativo para todos los dispositivos

### 🛒 **Versión 1.5** - E-commerce Completo (Septiembre 2024)

#### 💳 **Sistema de Pagos**
- **Múltiples Métodos**: Soporte para tarjetas principales
- **Gestión de Carrito**: Persistencia entre sesiones
- **Control de Stock**: Actualización automática de inventario
- **Historial de Compras**: Seguimiento completo para usuarios

#### 🌐 **Internacionalización**
- **Múltiples Monedas**: Sistema de conversión automática
- **Ubicaciones Geográficas**: Mapas integrados con Leaflet
- **Redes Sociales**: Enlaces configurables por administrador

---

## 🔬 Funcionalidades Técnicas Avanzadas

### 📈 **Performance y Optimización**
- **Lazy Loading**: Carga diferida de imágenes de productos
- **Compresión de Imágenes**: Optimización automática al subir
- **Cache de Sesiones**: Reducción de consultas a base de datos
- **Minificación CSS**: Variables CSS compiladas eficientemente

### 🛡 **Seguridad Empresarial**
- **Headers de Seguridad**: Helmet.js configurado para producción
- **Sanitización de Inputs**: Protección contra XSS y SQLi
- **CORS Configurado**: Políticas estrictas de origen cruzado
- **Logs de Auditoría**: Registro de acciones administrativas

### 🔄 **Mantenimiento y Escalabilidad**
- **Arquitectura Modular**: Separación clara de responsabilidades
- **API RESTful**: Endpoints bien documentados y versionados
- **Database Indexing**: Optimización de consultas MongoDB
- **Error Handling**: Manejo robusto de errores con logging

---

---

## 📚 Documentación Técnica Adicional

### 📄 **Archivos de Documentación**
- **`CORREOS-TEMATIZADOS.md`**: Documentación técnica completa del sistema de correos personalizados
- **`backend/test-correos-tematizados.js`**: Script de prueba para validar temas en correos
- **`backend/public/ejemplo-correo-tematizado.html`**: Vista previa visual de correos tematizados

### 🔧 **Archivos de Configuración Importantes**
- **`backend/models/Tema.js`**: Estructura de datos para temas y colores
- **`backend/public/js/sweetalert-tema.js`**: Configuración de SweetAlert2 con temas
- **`backend/public/js/tema-global.js`**: Sistema universal de aplicación de temas
- **`backend/public/css/style.css`**: Variables CSS y estilos de notificaciones

### 🧪 **Scripts de Utilidades**
- **`backend/check-config.js`**: Verificación de configuración del sistema
- **`backend/migrate-passwords.js`**: Migración de contraseñas a bcrypt
- **`backend/agregar-tema-global.js`**: Utilidad para agregar temas predefinidos

> 💡 **Tip**: Revisar estos archivos para entender la implementación técnica completa de cada funcionalidad.

---

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
- **GitHub**: [Usuario de GitHub]
- **Proyecto**: CatalogoTienda

---

**¡Gracias por contribuir al proyecto CatalogoTienda! 🛍️**
