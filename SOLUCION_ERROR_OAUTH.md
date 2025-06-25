# 🚨 ERROR: OAuth client was not found - SOLUCIÓN PASO A PASO

## ❌ **El Error:**
```
The OAuth client was not found.
Error 401: invalid_client
```

Este error indica que Google no reconoce las credenciales de OAuth configuradas en tu aplicación.

---

## ✅ **SOLUCIÓN RÁPIDA (5 minutos):**

### 🔧 **Paso 1: Crear Proyecto en Google Cloud Console**

1. **Ve a:** [Google Cloud Console](https://console.cloud.google.com/)
2. **Inicia sesión** con tu cuenta de Google
3. **Crea un nuevo proyecto:**
   - Haz clic en "Nuevo Proyecto"
   - Nombre: `CatalogoTienda-OAuth`
   - Haz clic en "Crear"

### 🔧 **Paso 2: Habilitar APIs**

1. **Ve a:** "APIs y servicios" > "Biblioteca"
2. **Busca:** "Google+ API"
3. **Haz clic:** "Habilitar"
4. **Busca:** "Google OAuth2 API" 
5. **Haz clic:** "Habilitar"

### 🔧 **Paso 3: Configurar Pantalla de Consentimiento**

1. **Ve a:** "APIs y servicios" > "Pantalla de consentimiento de OAuth"
2. **Selecciona:** "Externo"
3. **Completa el formulario:**
   - **Nombre de la aplicación:** `Catálogo Tienda`
   - **Correo de soporte:** tu correo
   - **Dominio autorizado:** `localhost` (para desarrollo)
   - **Correo de contacto del desarrollador:** tu correo
4. **Haz clic:** "Guardar y continuar"
5. **Omite** "Scopes" (deja por defecto)
6. **Omite** "Usuarios de prueba" (o agrega tu correo)

### 🔧 **Paso 4: Crear Credenciales OAuth 2.0**

1. **Ve a:** "APIs y servicios" > "Credenciales"
2. **Haz clic:** "Crear credenciales" > "ID de cliente de OAuth 2.0"
3. **Configura:**
   - **Tipo de aplicación:** "Aplicación web"
   - **Nombre:** `CatalogoTienda-Web`
   
4. **URLs autorizadas de JavaScript:**
   ```
   http://localhost:3000
   ```
   
5. **URIs de redirección autorizados:**
   ```
   http://localhost:3000/auth/google/callback
   ```

6. **Haz clic:** "Crear"

### 🔧 **Paso 5: Copiar Credenciales**

Después de crear las credenciales, Google te mostrará:
- **ID de cliente:** `algo-como-esto.apps.googleusercontent.com`
- **Secreto del cliente:** `GOCSPX-algo-como-esto`

**¡COPIA ESTOS VALORES!**

---

## 🔧 **PASO 6: Configurar en tu Aplicación**

### **Opción A: Directo en el código (para desarrollo)**

Abre `backend/server.js` y busca las líneas 163-164:

```javascript
clientID: process.env.GOOGLE_CLIENT_ID || 'demo-client-id-for-development',
clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-client-secret-for-development',
```

**Reemplaza por:**
```javascript
clientID: 'TU_CLIENT_ID_REAL.apps.googleusercontent.com',
clientSecret: 'TU_CLIENT_SECRET_REAL',
```

### **Opción B: Variables de entorno (recomendado)**

1. **Crea** archivo `.env` en la carpeta `backend/`:
```env
GOOGLE_CLIENT_ID=TU_CLIENT_ID_REAL.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET_REAL
```

2. **El código ya está preparado** para usar estas variables automáticamente.

---

## 🚀 **PASO 7: Probar la Configuración**

1. **Reinicia el servidor:**
   ```bash
   cd backend
   node server.js
   ```

2. **Ve a:** `http://localhost:3000`

3. **Haz clic:** "Iniciar Sesión"

4. **Haz clic:** "Continuar con Google"

5. **Debería redirigir** a Google para autenticación

---

## 🛠️ **CONFIGURACIÓN PARA PRODUCCIÓN**

Cuando subas tu aplicación a un servidor real:

### 1. **Actualizar URLs en Google Cloud Console:**
- **JavaScript origins:** `https://tu-dominio.com`
- **Redirect URIs:** `https://tu-dominio.com/auth/google/callback`

### 2. **Usar Variables de Entorno:**
```env
GOOGLE_CLIENT_ID=tu_client_id_real
GOOGLE_CLIENT_SECRET=tu_client_secret_real
BASE_URL=https://tu-dominio.com
```

### 3. **Configurar HTTPS obligatorio**

---

## 🐛 **Si Sigues Teniendo Problemas:**

### **Error: "This app isn't verified"**
- **Solución:** Es normal en desarrollo. Haz clic en "Advanced" > "Go to app (unsafe)"

### **Error: "redirect_uri_mismatch"**
- **Solución:** Verifica que la URL en Google Cloud Console sea exactamente: `http://localhost:3000/auth/google/callback`

### **Error: "access_denied"**
- **Solución:** El usuario canceló o hay problema con permisos. Revisa la pantalla de consentimiento.

---

## 📞 **Soporte Rápido:**

Si necesitas ayuda:
1. **Comparte** el ID de cliente (es seguro)
2. **NO compartas** el secreto del cliente
3. **Describe** el error exacto que ves

**Estado actual:** ✅ Credenciales temporales configuradas - Listo para configurar credenciales reales
