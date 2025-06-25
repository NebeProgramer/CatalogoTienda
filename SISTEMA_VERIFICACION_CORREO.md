# Sistema de Verificación de Correo Electrónico

Este sistema implementa verificación por correo electrónico para nuevas cuentas de usuario en CatalogoTienda.

## Características

- **Verificación automática**: Al crear una cuenta, se envía automáticamente un correo de verificación
- **Tokens seguros**: Utiliza UUID v4 para generar tokens únicos
- **Expiración de tokens**: Los tokens expiran en 24 horas por seguridad
- **Reenvío de correos**: Los usuarios pueden solicitar un nuevo correo de verificación
- **Cuentas bloqueadas**: Los usuarios no verificados no pueden iniciar sesión

## Flujo del Usuario

1. **Registro**: El usuario crea una cuenta con correo y contraseña
2. **Correo enviado**: Se envía automáticamente un correo de verificación
3. **Verificación**: El usuario hace clic en el enlace del correo
4. **Activación**: La cuenta se activa automáticamente (rol cambia de "no verificado" a "usuario")
5. **Acceso**: El usuario ya puede iniciar sesión normalmente

## Configuración de Correo

Para que el sistema funcione, necesitas configurar las siguientes variables de entorno:

```bash
# Configuración de correo electrónico
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicacion
BASE_URL=http://localhost:3000
```

### Configuración de Gmail

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Habilita la verificación en 2 pasos
3. Genera una "Contraseña de aplicación" específica
4. Usa esta contraseña en `EMAIL_PASS`

## Estados de Usuario

- **"no verificado"**: Usuario recién registrado, no puede iniciar sesión
- **"usuario"**: Usuario verificado, acceso normal a la plataforma
- **"admin"**: Usuario administrador (solo se asigna manualmente)

## Endpoints

### POST /api/crear-cuenta
Crea una nueva cuenta y envía correo de verificación.

### POST /api/iniciar-sesion
Verifica credenciales y estado de verificación.

### GET /verificar-correo?token=<token>
Activa la cuenta del usuario.

### POST /api/reenviar-verificacion
Envía un nuevo correo de verificación.

## Seguridad

- Los tokens expiran en 24 horas
- Las contraseñas se cifran con bcrypt (12 rounds)
- Rate limiting en el login
- Validación de IP para administradores

## Personalización

El template de correo se puede personalizar modificando la función `enviarCorreoVerificacion()` en `server.js`.

## Troubleshooting

### El correo no llega
- Verifica la configuración de EMAIL_USER/EMAIL_PASS
- Revisa la carpeta de spam
- Asegúrate de usar una contraseña de aplicación (no la contraseña normal)

### Error de token expirado
- Los tokens duran 24 horas
- Usa el botón "Reenviar verificación" para obtener un nuevo token

### Error de SMTP
- Verifica que Gmail tenga habilitada la verificación en 2 pasos
- Confirma que la contraseña de aplicación sea correcta
- Algunos proveedores pueden bloquear Gmail, considera usar otro proveedor SMTP
