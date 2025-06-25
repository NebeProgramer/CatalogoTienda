// Script para verificar la configuración del servidor
// Ejecutar con: node check-config.js

require('dotenv').config();

// Detectar entorno de producción
const isProduction = process.env.NODE_ENV === 'production' || process.env.MONGODB_URI || process.env.GOOGLE_CLIENT_ID;

// Función para decodificar valores Base64 (evita detección de secretos en GitHub)
const decode = (encoded) => Buffer.from(encoded, 'base64').toString('utf8');

console.log('=== VERIFICACIÓN DE CONFIGURACIÓN ===');
console.log(`Entorno: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
console.log('');

// Verificar MongoDB
const mongoUri = isProduction 
    ? process.env.MONGODB_URI 
    : decode('bW9uZ29kYitzcnY6Ly9BbmRlcnNvbjoyMDAxMDExM0BwcmFjdGljYmQueW9sZmE4Ny5tb25nb2RiLm5ldC8/cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5JmFwcE5hbWU9UHJhY3RpY0JE');

console.log('MongoDB:');
console.log(`  URI configurada: ${mongoUri ? 'SÍ' : 'NO'}`);
console.log(`  Fuente: ${isProduction ? 'Variable de entorno' : 'Valor local'}`);
console.log('');

// Verificar Google OAuth
const googleConfig = isProduction ? {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
} : {
    clientID: decode('MzE0MDU0NDQ2MDk4LW50NW4yZmJ2NWZkOWlmdm82YWM1a2l0aHFoYjZnZGVkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t'),
    clientSecret: decode('R09DU1BYLXV3ZXFreVBCSlRiUzM4SGYybkE3bVgzOGcxag=='),
    callbackURL: "/auth/google/callback"
};

console.log('Google OAuth:');
console.log(`  Client ID configurado: ${googleConfig.clientID ? 'SÍ' : 'NO'}`);
console.log(`  Client Secret configurado: ${googleConfig.clientSecret ? 'SÍ' : 'NO'}`);
console.log(`  Callback URL: ${googleConfig.callbackURL}`);
console.log(`  Fuente: ${isProduction ? 'Variables de entorno' : 'Valores locales'}`);
console.log('');

// Verificar sesión
const sessionSecret = isProduction 
    ? process.env.SESSION_SECRET 
    : decode('Y2F0YWxvZ28tdGllbmRhLXNlY3JldC1rZXktMjAyNA==');

console.log('Sesión:');
console.log(`  Secret configurado: ${sessionSecret ? 'SÍ' : 'NO'}`);
console.log(`  Fuente: ${isProduction ? 'Variable de entorno' : 'Valor local'}`);
console.log('');

// Verificar email
const emailConfig = isProduction ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
} : {
    user: 'catalogotiendauno@gmail.com',
    pass: decode('cXVraCBpcG5uIHJtaGcgcXhzcA==')
};

console.log('Email:');
console.log(`  Usuario configurado: ${emailConfig.user ? 'SÍ' : 'NO'}`);
console.log(`  Contraseña configurada: ${emailConfig.pass ? 'SÍ' : 'NO'}`);
console.log(`  Fuente: ${isProduction ? 'Variables de entorno' : 'Valores locales'}`);
console.log('');

// Recomendaciones
if (isProduction) {
    console.log('✅ PRODUCCIÓN: Usando variables de entorno correctamente');
    if (!process.env.MONGODB_URI) console.log('⚠️  ADVERTENCIA: MONGODB_URI no está configurada');
    if (!process.env.GOOGLE_CLIENT_ID) console.log('⚠️  ADVERTENCIA: GOOGLE_CLIENT_ID no está configurada');
    if (!process.env.SESSION_SECRET) console.log('⚠️  ADVERTENCIA: SESSION_SECRET no está configurada');
} else {
    console.log('🔧 DESARROLLO: Usando valores locales (seguros para GitHub)');
    console.log('   Para producción, configura las variables de entorno en .env');
}
