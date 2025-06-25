# Sistema de Verificación de Correo Electrónico

Este documento explica cómo configurar y usar el sistema de verificación de correo electrónico implementado en el proyecto.

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:

```env
# Configuración del servidor
PORT=3000
BASE_URL=http://localhost:3000

# Configuración de la base de datos
MONGODB_URI=mongodb://localhost:27017/catalogo-tienda

# Configuración de correo electrónico (REQUERIDO para verificación)
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion

# Configuración de sesión
SESSION_SECRET=tu-clave-secreta-muy-segura
```

### 2. Configuración de Gmail

Para usar Gmail como servicio de correo, necesitas:

1. **Habilitar la verificación en 2 pasos** en tu cuenta de Google
2. **Generar una contraseña de aplicación**:
   - Ve a tu cuenta de Google → Seguridad
   - En "Verificación en 2 pasos", busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   - Usa esta contraseña en `EMAIL_PASS`

### 3. URL Base

- **Desarrollo**: `BASE_URL=http://localhost:3000`
- **Producción**: `BASE_URL=https://tu-dominio.com`

## Funcionamiento

### Flujo de Registro

1. **Usuario se registra**: Llena el formulario de registro
2. **Cuenta creada pero no verificada**: Se crea con `isVerified: false` y `rol: 'no verificado'`
3. **Correo enviado**: Se envía automáticamente un correo con un token de verificación
4. **Usuario hace clic en el enlace**: El token se valida y la cuenta se activa
5. **Cuenta activada**: `isVerified: true` y `rol: 'usuario'`

### Flujo de Inicio de Sesión

1. **Usuario intenta iniciar sesión**
2. **Verificación de estado**: El sistema verifica si `isVerified: true`
3. **Si no está verificado**: Se muestra mensaje con opción de reenviar correo
4. **Si está verificado**: Se permite el acceso normal

## Endpoints Implementados

### POST `/api/crear-cuenta`
Crea una nueva cuenta de usuario y envía correo de verificación.

**Body:**
```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "contraseña123"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Cuenta creada exitosamente. Se ha enviado un correo de verificación...",
  "requiresVerification": true
}
```

### GET `/verificar-correo?token=TOKEN`
Verifica y activa una cuenta usando el token enviado por correo.

**Parámetros:**
- `token`: Token de verificación único

**Respuesta**: Página HTML confirmando la verificación

### POST `/api/reenviar-verificacion`
Reenvía el correo de verificación a una cuenta no verificada.

**Body:**
```json
{
  "correo": "usuario@ejemplo.com"
}
```

### POST `/api/iniciar-sesion`
Inicia sesión verificando que la cuenta esté activada.

**Body:**
```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "contraseña123",
  "ip": "192.168.1.1"
}
```

**Respuesta si no está verificado:**
```json
{
  "error": "Tu cuenta no ha sido verificada...",
  "requiresVerification": true
}
```

## Modelo de Usuario

```javascript
{
  correo: String,           // Email del usuario
  contrasena: String,       // Contraseña hasheada
  nombre: String,           // Nombre del usuario
  rol: String,              // 'no verificado' | 'usuario' | 'admin'
  isVerified: Boolean,      // false por defecto
  token: String,            // Token de verificación
  tokenExpira: Date,        // Expiración del token (24 horas)
  // ... otros campos
}
```

## Estructura del Correo de Verificación

El correo incluye:
- **Asunto**: "Verificación de cuenta - Catálogo Tienda"
- **Contenido HTML** con diseño responsive
- **Botón de verificación** con enlace directo
- **Enlace alternativo** para copiar/pegar
- **Información de expiración** (24 horas)

## Frontend - Integración

### Registro
```javascript
// El frontend maneja automáticamente la respuesta requiresVerification
// y muestra un modal informativo con opción de reenvío
```

### Inicio de Sesión
```javascript
// Si la respuesta incluye requiresVerification: true,
// se muestra un modal con opción de reenviar verificación
```

## Seguridad

- **Tokens únicos**: Cada verificación usa un UUID único
- **Expiración**: Los tokens expiran en 24 horas
- **Validación**: Se valida token y expiración en cada verificación
- **Limpieza**: Los tokens se eliminan tras verificación exitosa

## Desarrollo vs Producción

### Desarrollo
- Usa credenciales hardcodeadas (encode/decode)
- Base URL: `http://localhost:3000`

### Producción
- Usa variables de entorno
- Base URL configurable
- Credenciales seguras

## Resolución de Problemas

### Correo no se envía
1. Verificar `EMAIL_USER` y `EMAIL_PASS`
2. Confirmar que la contraseña de aplicación es correcta
3. Revisar logs del servidor para errores

### Token inválido
1. Verificar que no haya expirado (24 horas)
2. Confirmar que el enlace está completo
3. Verificar que no se haya usado ya

### Usuario no recibe correo
1. Revisar carpeta de spam
2. Verificar que la dirección sea correcta
3. Intentar reenviar verificación

## Comandos Útiles

```bash
# Iniciar servidor en desarrollo
npm run dev

# Verificar configuración
npm run check-config

# Ver logs del servidor
tail -f logs/server.log
```

## Próximas Mejoras

1. **Templates personalizables** para correos
2. **Múltiples proveedores** de correo
3. **Verificación por SMS** opcional
4. **Dashboard de administración** para gestionar verificaciones
5. **Estadísticas** de verificaciones enviadas/completadas

---

**Nota**: Este sistema es esencial para la seguridad y debe estar configurado correctamente antes del despliegue en producción.
