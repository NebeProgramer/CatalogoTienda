# 🔑 Configuración de Google OAuth para CatalogoTienda

## 📋 Instrucciones de Configuración

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ y Google OAuth2

### 2. Configurar OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth 2.0 Client IDs**
3. Selecciona **Web application**
4. Configura las URLs:
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/google/callback` (desarrollo)
     - `https://tu-dominio.com/auth/google/callback` (producción)

### 3. Obtener Credenciales

1. Copia el **Client ID** y **Client Secret**
2. Guarda estos valores de forma segura

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui

# Base URL para callbacks
BASE_URL=http://localhost:3000

# Configuración de sesión (opcional - cambiar en producción)
SESSION_SECRET=catalogo-tienda-secret-key-2024
```

### 5. Actualizar server.js (si usas variables de entorno)

Si quieres usar variables de entorno, actualiza las líneas en `server.js`:

```javascript
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    // ... resto del código
}));
```

### 6. Agregar Botón a HTML

En tus archivos HTML de login, agrega la sección de Google OAuth:

```html
<!-- En el modal de inicio de sesión, después del formulario existente -->
<div class="google-auth-section">
    <div id="google-login-container">
        <!-- El botón se creará dinámicamente con JavaScript -->
    </div>
    <div class="login-separator">O</div>
</div>

<!-- Script para inicializar el botón -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('google-login-container');
    if (container && typeof crearBotonGoogle === 'function') {
        crearBotonGoogle(container);
    }
});
</script>
```

## 🔧 Funcionalidades Implementadas

### ✅ Frontend (Sesion.js)
- `iniciarSesionGoogle()`: Redirige a Google OAuth
- `verificarAutenticacionGoogle()`: Verifica autenticación exitosa
- `crearBotonGoogle()`: Crea botón con diseño de Google
- `verificarParametrosGoogle()`: Detecta retorno de Google
- `actualizarInterfazUsuario()`: Actualiza UI tras login

### ✅ Backend (server.js)
- Configuración completa de Passport.js
- Estrategia de Google OAuth 2.0
- Rutas `/auth/google` y `/auth/google/callback`
- Endpoint `/api/auth/user` para verificar sesión
- Serialización/deserialización de usuarios

### ✅ Base de Datos (perfil.js)
- Campos `googleId` y `fotoGoogle` agregados
- Creación automática de usuarios desde Google
- Vinculación de cuentas existentes por email

### ✅ Estilos (style.css)
- Botón con diseño oficial de Google
- Separador "O" entre métodos de login
- Diseño responsive y accesible

## 🚀 Cómo Usar

### Para Desarrollo Local:

1. **Configurar credenciales temporales** (para pruebas):
   ```javascript
   // En server.js, reemplaza:
   clientID: 'pendiente-configurar',
   clientSecret: 'pendiente-configurar',
   
   // Por tus credenciales reales:
   clientID: 'tu_client_id_real.apps.googleusercontent.com',
   clientSecret: 'tu_client_secret_real',
   ```

2. **Agregar HTML**:
   - Busca el modal de inicio de sesión en `index.html`
   - Agrega la sección de Google antes del formulario existente
   - Incluye el script de inicialización

3. **Probar funcionalidad**:
   - Reinicia el servidor: `npm start`
   - Ve a `http://localhost:3000`
   - Haz clic en "Iniciar con Google"

### Para Producción:

1. Configurar variables de entorno en tu servidor
2. Actualizar URLs en Google Cloud Console
3. Usar HTTPS obligatoriamente
4. Configurar dominio real en las variables

## 🛡️ Seguridad

### ✅ Implementado:
- Serialización segura de sesiones
- Validación de emails únicos
- Headers de seguridad actualizados para Google
- Rate limiting aplicado

### 🔒 Recomendaciones:
- Usar HTTPS en producción
- Rotar secrets regularmente
- Monitorear intentos de autenticación
- Implementar logout completo de Google

## 🐛 Troubleshooting

### Error: "Invalid client_id"
- Verifica que el Client ID esté correctamente configurado
- Asegúrate de que el dominio esté autorizado en Google Cloud

### Error: "Redirect URI mismatch"
- Verifica que la URL de callback esté registrada en Google Cloud
- Confirma que coincida exactamente (incluye el protocolo http/https)

### Error: "Access blocked"
- Asegúrate de que la API de Google+ esté habilitada
- Verifica que el proyecto de Google Cloud esté activo

### Usuario no se guarda en base de datos:
- Revisa los logs del servidor para errores de MongoDB
- Verifica que los campos requeridos estén siendo populados

## 📞 Soporte

Si necesitas ayuda con la configuración o tienes errores, proporciona:
1. Mensaje de error exacto
2. Configuración de Google Cloud Console
3. Logs del servidor (sin credenciales)

**Estado**: ✅ Implementación completa lista para configurar credenciales
