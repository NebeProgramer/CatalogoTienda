// CONFIGURACIÓN DE CATÁLOGO TIENDA
// Las credenciales sensibles se manejan mediante variables de entorno (.env)
// Para desarrollo local: copiar .env.example como .env y completar credenciales
// IMPORTANTE: El archivo .env no debe subirse a Git (está en .gitignore)

require('dotenv').config();

// Detectar entorno de producción
const isProduction = process.env.NODE_ENV === 'production';

console.log('🌍 Entorno detectado:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('📁 Variables de entorno cargadas:', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ Faltante',
    MONGODB_URI: process.env.MONGODB_URI ? '✅ Configurado' : '❌ Faltante',
    EMAIL_USER: process.env.EMAIL_USER ? '✅ Configurado' : '❌ Faltante'
});
const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Usuario = require('./models/perfil'); // Importando el modelo de perfil
const Producto = require('./models/productos'); // Importando el modelo de producto
const Mensaje = require('./models/mensajes'); // Importando el modelo de mensajes
const CompanyInfo = require('./models/CompanyInfo'); // Asegurar que el modelo esté correctamente importado
const cors = require('cors');
const TermsAndConditions = require('./models/termsAndConditions'); // Importando el modelo de términos y condiciones
const Moneda = require('./models/Moneda'); // Importar modelo Moneda con la ruta correcta
const Ubicacion = require('./models/Ubicacion'); // Importar modelo Ubicacion con la ruta correcta
const Categoria = require('./models/categoria'); // Importar el modelo de categorías
const Tema = require('./models/Tema'); // Importar modelo de Temas
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique ID generation
const RedSocial = require('./models/redSocial'); // Import the RedSocial model
const IPPermitida = require('./models/ipPermitida'); // Importa el modelo de IP permitida
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Importar bcrypt para cifrado de contraseñas
const compression = require('compression'); // Compresión gzip
const helmet = require('helmet'); // Headers de seguridad
const rateLimit = require('express-rate-limit'); // Rate limiting
const passport = require('passport'); // Autenticación
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Google OAuth
const session = require('express-session'); // Manejo de sesiones

const app = express();
const port =8080;

// Conexión a MongoDB usando variables de entorno
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('❌ ERROR: MONGODB_URI no está configurada en el archivo .env');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('✅ Conexión a MongoDB exitosa');
        console.log('🔗 URI utilizada:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales en logs
    })
    .catch((error) => {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    });

// Verificar conexión a MongoDB

mongoose.connection.on('error', (err) => {
    console.error('Error en la conexión a MongoDB:', err);
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(express.urlencoded({ extended: true })); // Middleware para procesar datos de formularios

// Configurar CORS
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
}));

// ===== MIDDLEWARE DE SEGURIDAD Y RENDIMIENTO =====

// Configuración de multer para guardar imágenes
const storageProductos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'productos'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const storageSobreNosotros = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'img'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// Configuración de multer para fotos de perfil
const storagePerfiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'img', 'perfiles'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `perfil-${uniqueSuffix}-${file.originalname}`);
    }
});

const uploadProductos = multer({ storage: storageProductos });
const uploadSobreNosotros = multer({ storage: storageSobreNosotros });
const uploadPerfiles = multer({ storage: storagePerfiles });

// 1. Compresión gzip para mejorar velocidad de transferencia
app.use(compression());

// 2. Headers de seguridad con Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://code.jquery.com", "https://accounts.google.com", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "blob:", "https://lh3.googleusercontent.com", "https://accounts.google.com", "https://cdn.simpleicons.org"],
            connectSrc: ["'self'", "https://accounts.google.com", "https://api.ipify.org"],
            frameSrc: ["'self'", "https://accounts.google.com", "https://www.google.com", "https://maps.google.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// ===== CONFIGURACIÓN DE RATE LIMITING =====
// Rate limiting estricto para endpoints de autenticación
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos de login por IP cada 15 minutos
    message: {
        error: 'Demasiados intentos de inicio de sesión, intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Permitir reset manual del contador
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: (req) => {
        return req.ip; // Usar IP como clave para el rate limiting
    }
});

// ===== CONFIGURACIÓN DE SESIONES Y PASSPORT =====
// NOTA: No aplicamos rate limiting general para permitir uso normal de todas las APIs
// Solo se aplica rate limiting estricto a la ruta de inicio de sesión
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    console.error('❌ ERROR: SESSION_SECRET no está configurada en el archivo .env');
    process.exit(1);
}

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// ===== CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS CON CACHÉ =====

// Middleware para caché de archivos estáticos
app.use('/productos', express.static(path.join(__dirname, '..', 'public', 'productos'), {
    maxAge: '30d', // Caché por 30 días
    etag: true,
    lastModified: true
}));

app.use('/img', express.static(path.join(__dirname, '..', 'public', 'img'), {
    maxAge: '7d', // Caché por 7 días
    etag: true,    lastModified: true
}));

// ===== FUNCIÓN PARA DESCARGAR IMAGEN DE GOOGLE =====
async function descargarImagenGoogle(urlImagen, nombreUsuario) {
    return new Promise((resolve, reject) => {
        if (!urlImagen) {
            resolve(null);
            return;
        }

        // Crear nombre único para la imagen
        const timestamp = Date.now();
        const extension = '.jpg'; // Google siempre devuelve JPEG
        const nombreArchivo = `google_${nombreUsuario}_${timestamp}${extension}`;
        const rutaCompleta = path.join(__dirname, 'public', 'img', 'perfiles', nombreArchivo);
        const rutaRelativa = `/img/perfiles/${nombreArchivo}`;

        // Asegurar que el directorio existe
        const directorioPerfiles = path.join(__dirname, 'public', 'img', 'perfiles');
        if (!fs.existsSync(directorioPerfiles)) {
            fs.mkdirSync(directorioPerfiles, { recursive: true });
        }

        // Descargar la imagen
        const archivo = fs.createWriteStream(rutaCompleta);
        
        https.get(urlImagen, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Error al descargar imagen: ${response.statusCode}`));
                return;
            }

            response.pipe(archivo);

            archivo.on('finish', () => {
                archivo.close();
                console.log(`Imagen de Google descargada: ${nombreArchivo}`);
                resolve(rutaRelativa);
            });

            archivo.on('error', (err) => {
                fs.unlink(rutaCompleta, () => {}); // Eliminar archivo parcial
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// ===== CONFIGURACIÓN DE GOOGLE OAUTH =====
const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
};

// Verificar que las credenciales de Google estén configuradas
if (!googleConfig.clientID || !googleConfig.clientSecret) {
    console.error('❌ ERROR: Credenciales de Google OAuth no configuradas correctamente');
    console.log('📋 Para configurar Google OAuth:');
    console.log('1. Ve a https://console.cloud.google.com/');
    console.log('2. Crea un proyecto o selecciona uno existente');
    console.log('3. Habilita la API de Google+ o Google People API');
    console.log('4. Crea credenciales OAuth 2.0');
    console.log('5. Agrega http://localhost:3000/auth/google/callback como URI de redirección');
    console.log('6. Actualiza el archivo .env con GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET');
} else {
    console.log('✅ Google OAuth configurado correctamente');
    console.log('🔑 Client ID:', googleConfig.clientID.substring(0, 20) + '...');
}

passport.use(new GoogleStrategy(googleConfig, async (accessToken, refreshToken, profile, done) => {
    try {
        let usuario = await Usuario.findOne({ correo: profile.emails[0].value });
        
        // Descargar imagen de Google si existe
        let fotoPerfilLocal = null;
        if (profile.photos && profile.photos[0] && profile.photos[0].value) {
            try {
                const nombreUsuario = profile.name.givenName.toLowerCase().replace(/[^a-z0-9]/g, '');
                fotoPerfilLocal = await descargarImagenGoogle(profile.photos[0].value, nombreUsuario);
            } catch (error) {
                console.error('Error al descargar imagen de Google:', error);
                // Continuar sin la imagen si hay error
            }
        }
        
        if (usuario) {
            usuario.googleId = profile.id;
            usuario.nombre = usuario.nombre || profile.name.givenName;
            usuario.apellido = usuario.apellido || profile.name.familyName;
            usuario.fotoGoogle = profile.photos[0]?.value;
            
            // Actualizar foto de perfil local solo si se descargó exitosamente
            if (fotoPerfilLocal) {
                // Si ya tenía una foto de perfil local anterior, eliminarla
                if (usuario.fotoPerfil) {
                    const rutaAnterior = path.join(__dirname, 'public', usuario.fotoPerfil);
                    if (fs.existsSync(rutaAnterior)) {
                        fs.unlinkSync(rutaAnterior);
                    }
                }
                usuario.fotoPerfil = fotoPerfilLocal;
            }
            
            await usuario.save();
            return done(null, usuario);
        } else {
            const nuevoUsuario = new Usuario({
                googleId: profile.id,
                correo: profile.emails[0].value,
                nombre: profile.name.givenName,
                apellido: profile.name.familyName,
                fotoGoogle: profile.photos[0]?.value,
                fotoPerfil: fotoPerfilLocal, // Guardar la imagen local
                contrasena: 'google-oauth',
                telefono: "",
                direccion: [],
                descripcion: "",
                tarjeta: [],
                carrito: [],
                registroCompras: [],
                rol: 'usuario',
                isVerified: true, // Marcar como verificado por defecto
            });
            
            await nuevoUsuario.save();
            return done(null, nuevoUsuario);
        }
    } catch (error) {
        console.error('Error en Google OAuth:', error);
        return done(error, null);
    }
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findById(id);
        done(null, usuario);
    } catch (error) {
        done(error, null);
    }
});

// ===== RUTAS DE GOOGLE OAUTH =====
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {        // *** NUEVO: Reiniciar contador de rate limit para esta IP al tener login exitoso con Google ***
        try {
            const key = req.ip; // Usar directamente la IP como clave
            // Resetear usando el método correcto del rate limiter
            if (authLimiter.resetKey) {
                authLimiter.resetKey(key);
            } else if (authLimiter.store && authLimiter.store.resetKey) {
                authLimiter.store.resetKey(key);
            } else if (authLimiter.store && authLimiter.store.delete) {
                authLimiter.store.delete(key);
            }
            console.log(`Rate limit reset para IP: ${req.ip} después de login exitoso con Google`);
        } catch (resetError) {
            console.error('Error al resetear rate limit para Google OAuth:', resetError);
        }
            
        console.log('✅ Login exitoso con Google:', req.user);
        res.redirect('/?google_login=success');
    }
);

// Endpoint para obtener datos del usuario autenticado con Google
app.get('/api/auth/user', (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});

// Endpoint para cerrar sesión
app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión.' });
        }

        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Muy importante
            res.status(200).json({ message: 'Sesión cerrada correctamente.' });
        });
    });
});


// Endpoint para obtener los productos
app.get('/api/productos', async (req, res) => {
    try {
        const { correo } = req.query;

        if (correo) {
            const productosUsuario = await Producto.find({ correo });
            return res.status(200).json(productosUsuario);
        }

        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

// Endpoint para crear un nuevo producto
app.post('/api/productos', uploadProductos.array('imagenes', 10), async (req, res) => {
    try {
        const nuevoProducto = req.body;
        const imagenes = req.files.map((file) => `/productos/${file.filename}`);

        const ultimoProducto = await Producto.findOne().sort({ id: -1 });
        const nuevoId = ultimoProducto ? ultimoProducto.id + 1 : 1;

        const producto = new Producto({
            id: nuevoId,
            nombre: nuevoProducto.nombre,
            descripcion: nuevoProducto.descripcion,
            categoria: nuevoProducto.categoria,
            precio: parseFloat(nuevoProducto.precio),
            moneda: nuevoProducto.moneda,
            stock: parseInt(nuevoProducto.stock, 10),
            imagenes,
            correo: nuevoProducto.correo,
            destacado: false,
            calificacion: 0,
            estado: 'disponible',
            comentarios: []
        });

        await producto.save();
        res.status(201).json({ message: 'Producto creado exitosamente.', producto });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto.' });
    }
});

// Endpoint para obtener un producto por su ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findOne({ id });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

// Endpoint para eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findOneAndDelete({ id });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        producto.imagenes.forEach((imagenPath) => {
            const fullPath = path.join(__dirname, 'public', imagenPath);
            if (fs.existsSync(fullPath)) {
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error(`Error al eliminar la imagen ${fullPath}:`, err);
                    } else {
                        console.log(`Imagen eliminada: ${fullPath}`);
                    }
                });
            }
        });

        // Eliminar el producto de todos los carritos de usuarios
        await Usuario.updateMany(
            {},
            { $pull: { carrito: { id: parseInt(id, 10) } } }
        );
        // Eliminar el producto de todos los registros de compra de usuarios
        await Usuario.updateMany(
            {},
            { $pull: { registroCompra: { id: parseInt(id, 10) } } }
        );

        res.status(200).json({ message: 'Producto eliminado exitosamente.', producto });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});

// Endpoint para actualizar un producto existente
app.put('/api/productos/:id', uploadProductos.array('imagenes', 10), async (req, res) => {
    try {
        const { id } = req.params;
        const productoActualizado = req.body;

        // Si se suben nuevas imágenes, combinarlas con las existentes
        if (req.files.length > 0) {
            const nuevasImagenes = req.files.map((file) => `/productos/${file.filename}`);
            const productoExistente = await Producto.findOne({ id });

            if (productoExistente) {
                productoActualizado.imagenes = [...productoExistente.imagenes, ...nuevasImagenes];
            } else {
                productoActualizado.imagenes = nuevasImagenes;
            }
        }

        const producto = await Producto.findOneAndUpdate(
            { id },
            {
                ...productoActualizado,
                precio: parseFloat(productoActualizado.precio),
                stock: parseInt(productoActualizado.stock, 10)
            },
            { new: true }
        );

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente.', producto });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

// Endpoint para actualizar la disponibilidad de un producto
app.patch('/api/productos/:id/disponibilidad', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ error: 'El estado es obligatorio.' });
        }

        const producto = await Producto.findOneAndUpdate(
            { id },
            { estado },
            { new: true }
        );

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Disponibilidad del producto actualizada exitosamente.', producto });
    } catch (error) {
        console.error('Error al actualizar la disponibilidad del producto:', error);
        res.status(500).json({ error: 'Error al actualizar la disponibilidad del producto.' });
    }
});

// Endpoint para agregar un comentario a un producto
app.post('/api/productos/:id/comentarios', async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, correo, comentario, calificacion } = req.body;

        if (!usuario || !correo || !comentario || calificacion == null) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }


        const producto = await Producto.findOne({ id });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        producto.comentarios.push({ usuario, correo, comentario, calificacion });
        producto.calificacion =
            producto.comentarios.reduce((sum, c) => sum + c.calificacion, 0) / producto.comentarios.length;

        await producto.save();
        res.status(201).json({ message: 'Comentario agregado exitosamente', producto });
    } catch (error) {
        console.error('Error al agregar el comentario:', error);
        res.status(500).json({ error: 'Error al agregar el comentario.' });
    }
});

app.put('/api/productos/:id/comentarios/:comentarioId', async (req, res) => {
    try {
        const { id, comentarioId } = req.params;
        const { comentario, calificacion } = req.body;

        if (!comentario || calificacion == null) {
            return res.status(400).json({ error: 'Comentario y calificación son obligatorios.' });
        }

        const producto = await Producto.findOne({ id });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const comentarioExistente = producto.comentarios.id(comentarioId);
        if (!comentarioExistente) {
            return res.status(404).json({ error: 'Comentario no encontrado.' });
        }

        comentarioExistente.comentario = comentario;
        comentarioExistente.calificacion = calificacion;

        producto.calificacion =
            producto.comentarios.reduce((sum, c) => sum + c.calificacion, 0) / producto.comentarios.length;

        await producto.save();
        res.status(200).json({ message: 'Comentario actualizado exitosamente.', producto });
    } catch (error) {
        console.error('Error al actualizar el comentario:', error);
        res.status(500).json({ error: 'Error al actualizar el comentario.' });
    }
});

// Endpoints de usuarios

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verificar configuración de email
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ ERROR: EMAIL_USER o EMAIL_PASS no están configuradas en el archivo .env');
    console.log('📧 Para configurar el email:');
    console.log('1. Actualiza EMAIL_USER con tu correo de Gmail');
    console.log('2. Actualiza EMAIL_PASS con tu contraseña de aplicación de Gmail');
} else {
    console.log('✅ Configuración de email cargada correctamente');
    console.log('📧 Email configurado:', process.env.EMAIL_USER);
}

// Función para enviar correo de verificación
// Función para generar código de verificación de 6 dígitos
function generarCodigoVerificacion() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Función para enviar correo de verificación con código de 6 dígitos
async function enviarCorreoVerificacion(correo, codigo) {
    const mailOptions = {
        from: process.env.EMAIL_USER || 'pawmarket@gmail.com',
        to: correo,
        subject: 'Verificación de cuenta - PawMarket',
        html: `
            <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #e6a300 0%, #d49000 100%); padding: 40px 30px; text-align: center; color: white;">
                    <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🐾 PawMarket 🐾</h1>
                    <p style="font-size: 16px; opacity: 0.9; margin: 0;">Tu marketplace de mascotas favorito</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <span style="font-size: 64px; margin-bottom: 20px; display: block;">🎉</span>
                        <h2 style="font-size: 24px; font-weight: 600; color: #2c2c2c; margin-bottom: 12px;">¡Bienvenido a PawMarket!</h2>
                        <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">Estás a un paso de disfrutar del mejor marketplace para mascotas</p>
                    </div>

                    <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffffff 100%); border: 2px solid #ddd; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                        <h3 style="font-size: 18px; font-weight: 600; color: #2c2c2c; margin-bottom: 15px;">Tu código de verificación</h3>
                        <div style="font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 36px; font-weight: 700; color: #d49000; background: white; padding: 20px 30px; border-radius: 12px; border: 3px solid #e6a300; letter-spacing: 8px; margin: 20px 0; display: inline-block; box-shadow: 0 4px 15px rgba(230, 163, 0, 0.2);">${codigo}</div>
                        <p style="color: #555555; margin-top: 15px;">Este código expira en 1 hora</p>
                    </div>

                    <div style="background: #ffffff; border-left: 4px solid #e6a300; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 600; margin-bottom: 8px;">📋 Instrucciones</h3>
                        <p style="color: #555555; font-size: 14px; margin: 0;">Ingresa este código en la página de verificación para activar tu cuenta. No compartas este código con nadie.</p>
                        <a href="http://localhost:3000/verificar-cuenta/" style="color: #e6a300; text-decoration: underline;">Ir a la página de verificación</a>
                    </div>

                    <div style="height: 1px; background: linear-gradient(90deg, transparent, #ddd, transparent); margin: 30px 0;"></div>

                    <div style="background: #ffffff; border-left: 4px solid #e6a300; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 600; margin-bottom: 8px;">🔒 Seguridad</h3>
                        <p style="color: #555555; font-size: 14px; margin: 0;">Este correo fue enviado porque solicitaste crear una cuenta en PawMarket. Si no fuiste tú, puedes ignorar este mensaje de forma segura.</p>
                    </div>

                    <div style="background: #ffffff; border-left: 4px solid #e6a300; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 600; margin-bottom: 8px;">📧 ¿Necesitas ayuda?</h3>
                        <p style="color: #555555; font-size: 14px; margin: 0;">Si tienes alguna pregunta, no dudes en contactarnos. Nuestro equipo de soporte está aquí para ayudarte.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #fff5e6; padding: 30px; text-align: center; border-top: 1px solid #ddd;">
                    <p style="color: #555555; font-size: 14px; margin-bottom: 15px;">© 2025 PawMarket. Todos los derechos reservados.</p>
                    
                    <div style="margin: 20px 0;">
                        <a href="#" style="display: inline-block; margin: 0 8px; color: #e6a300; text-decoration: none; font-size: 24px;">📧</a>
                        <a href="#" style="display: inline-block; margin: 0 8px; color: #e6a300; text-decoration: none; font-size: 24px;">📱</a>
                        <a href="#" style="display: inline-block; margin: 0 8px; color: #e6a300; text-decoration: none; font-size: 24px;">🌐</a>
                        <a href="#" style="display: inline-block; margin: 0 8px; color: #e6a300; text-decoration: none; font-size: 24px;">📞</a>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">Este es un correo automático, por favor no respondas a esta dirección.</p>
                </div>
            </div>
        `
    };
    
    try {
        console.log('📧 [EMAIL] Enviando código de verificación a:', correo);
        await transporter.sendMail(mailOptions);
        console.log('✅ [EMAIL] Código de verificación enviado exitosamente');
        return true;
    } catch (error) {
        console.error('❌ [EMAIL] Error al enviar código de verificación:', error);
        return false;
    }
}

// Endpoint para crear una cuenta de usuario
app.post('/api/crear-cuenta', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
        }

        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico.' });
        }

        // Cifrar la contraseña antes de guardarla
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Generar código de verificación de 6 dígitos
        const codigoVerificacion = generarCodigoVerificacion();
        const tokenExpira = new Date();
        tokenExpira.setHours(tokenExpira.getHours() + 1); // Expira en 1 hora

        const newUser = new Usuario({
            correo,
            contrasena: hashedPassword,
            nombre: "",
            apellido: "",
            telefono: "",
            direccion: [],
            descripcion: "",
            tarjeta: [],
            carrito: [],
            registroCompras: [],
            rol: 'no verificado',
            isVerified: false,
            token: codigoVerificacion, // El token ahora es el código de 6 dígitos
            tokenExpira: tokenExpira
        });

        await newUser.save();

        // Enviar correo de verificación
        const correoEnviado = await enviarCorreoVerificacion(correo, codigoVerificacion);

        if (correoEnviado) {
            res.status(201).json({ 
                message: 'Cuenta creada exitosamente. Se ha enviado un correo de verificación a tu dirección de correo electrónico.',
                requiresVerification: true
            });
        } else {
            res.status(201).json({ 
                message: 'Cuenta creada exitosamente, pero hubo un problema al enviar el correo de verificación. Contacta al soporte.',
                requiresVerification: true
            });
        }
    } catch (error) {
        console.error('Error al crear la cuenta:', error);
        res.status(500).json({ error: 'Error al crear la cuenta.' });
    }
});

// Endpoint para iniciar sesión (con rate limiting estricto)
app.post('/api/iniciar-sesion', authLimiter, async (req, res) => {
    try {
        const { correo, contrasena, ip } = req.body;
        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
        }
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Credenciales incorrectas.' });
        }
        
        // Verificar la contraseña cifrada
        const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // Verificar si la cuenta está verificada
        if (!usuario.isVerified) {
            return res.status(403).json({ 
                error: 'Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico y haz clic en el enlace de verificación.',
                requiresVerification: true
            });
        }

        // Si es admin, verificar IP
        if (usuario.rol === 'admin') {
            // Obtener IP pública del request
            
            // Limpiar IPv6 localhost
            const IPPermitida = require('./models/ipPermitida');
            const ipRegistrada = await IPPermitida.findOne({ direccionIP: ip });
            if (!ipRegistrada) {
                return res.status(403).json({ error: 'Acceso denegado: la IP no está registrada para administradores.' });
            }        }        // *** NUEVO: Reiniciar contador de rate limit para esta IP al tener login exitoso ***
        try {
            // Obtener la store del rate limiter (que usa MemoryStore por defecto)
            const key = req.ip; // Usar directamente la IP como clave
            // Resetear usando el método correcto del rate limiter
            if (authLimiter.resetKey) {
                authLimiter.resetKey(key);
            } else if (authLimiter.store && authLimiter.store.resetKey) {
                authLimiter.store.resetKey(key);
            } else if (authLimiter.store && authLimiter.store.delete) {
                authLimiter.store.delete(key);
            }
            console.log(`Rate limit reset para IP: ${req.ip} después de login exitoso`);
        } catch (resetError) {
            // Si hay error al resetear, solo loggearlo pero no fallar el login
            console.error('Error al resetear rate limit:', resetError);
        }

        res.status(200).json({ user: usuario });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión.' });    }
});

// Endpoint para verificar correo electrónico
// Endpoint para verificar cuenta con código de 6 dígitos
app.post('/api/verificar-codigo', async (req, res) => {
    try {
        const { correo, codigo } = req.body;
        
        if (!correo || !codigo) {
            return res.status(400).json({ error: 'Correo y código son obligatorios.' });
        }
        
        // Buscar usuario por correo y código
        const usuario = await Usuario.findOne({ 
            correo: correo,
            token: codigo,
            tokenExpira: { $gt: new Date() } // Token no expirado
        });
        
        if (!usuario) {
            return res.status(400).json({ error: 'Código inválido o expirado.' });
        }
        
        // Activar la cuenta
        usuario.isVerified = true;
        usuario.rol = 'usuario';
        usuario.token = '';
        usuario.tokenExpira = null;
        await usuario.save();
        
        res.status(200).json({ 
            message: '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.',
            success: true
        });
        
    } catch (error) {
        console.error('Error al verificar código:', error);
        res.status(500).json({ error: 'Error del servidor al verificar el código.' });
    }
});

// Endpoint legacy para verificar correo (mantenerlo para compatibilidad)
app.get('/verificar-correo', async (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).send(`
                <html>
                    <head>
                        <title>Error de Verificación</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .error { color: #d32f2f; }
                        </style>
                    </head>
                    <body>
                        <h1 class="error">Token de verificación faltante</h1>
                        <p>El enlace de verificación es inválido.</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                </html>
            `);
        }
        
        // Buscar usuario por token
        const usuario = await Usuario.findOne({ 
            token: token,
            tokenExpira: { $gt: new Date() } // Token no expirado
        });
        
        if (!usuario) {
            return res.status(400).send(`
                <html>
                    <head>
                        <title>Error de Verificación</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .error { color: #d32f2f; }
                        </style>
                    </head>
                    <body>
                        <h1 class="error">Token de verificación inválido o expirado</h1>
                        <p>El enlace de verificación ha expirado o no es válido.</p>
                        <p>Por favor, solicita un nuevo correo de verificación.</p>
                        <a href="/">Volver al inicio</a>
                    </body>
                </html>
            `);
        }
        
        // Activar la cuenta
        usuario.isVerified = true;
        usuario.rol = 'usuario';
        usuario.token = '';
        usuario.tokenExpira = null;
        await usuario.save();
        
        res.send(`
            <html>
                <head>
                    <title>Cuenta Verificada</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .success { color: #2e7d32; }
                        .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h1 class="success">¡Cuenta verificada exitosamente!</h1>
                    <p>Tu cuenta ha sido activada. Ya puedes iniciar sesión y disfrutar de todos nuestros servicios.</p>
                    <a href="/" class="btn">Iniciar Sesión</a>
                </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Error al verificar correo:', error);
        res.status(500).send(`
            <html>
                <head>
                    <title>Error del Servidor</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #d32f2f; }
                    </style>
                </head>
                <body>
                    <h1 class="error">Error del servidor</h1>
                    <p>Ocurrió un error al verificar tu cuenta. Por favor, inténtalo más tarde.</p>
                    <a href="/">Volver al inicio</a>
                </body>
            </html>
        `);
    }
});

// Endpoint para reenviar correo de verificación
app.post('/api/reenviar-verificacion', async (req, res) => {
    try {
        const { correo } = req.body;
        
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'No se encontró una cuenta con este correo electrónico.' });
        }
        
        if (usuario.isVerified) {
            return res.status(400).json({ error: 'Esta cuenta ya está verificada.' });
        }
        
        // Generar nuevo código de verificación de 6 dígitos
        const nuevoCodigo = generarCodigoVerificacion();
        const nuevaExpiracion = new Date();
        nuevaExpiracion.setHours(nuevaExpiracion.getHours() + 1); // Expira en 1 hora
        
        usuario.token = nuevoCodigo;
        usuario.tokenExpira = nuevaExpiracion;
        await usuario.save();
        
        // Enviar nuevo correo de verificación
        const correoEnviado = await enviarCorreoVerificacion(correo, nuevoCodigo);
        
        if (correoEnviado) {
            res.json({ message: 'Se ha enviado un nuevo correo de verificación a tu dirección de correo electrónico.' });
        } else {
            res.status(500).json({ error: 'Error al enviar el correo de verificación. Inténtalo más tarde.' });
        }
        
    } catch (error) {
        console.error('Error al reenviar verificación:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

// Endpoint para obtener el perfil de un usuario
app.get('/api/perfil', async (req, res) => {
    try {
        const { correo } = req.query;

        if (!correo) {
            return res.status(400).json({ error: 'El correo es obligatorio' });
        }

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ error: 'Error al obtener el perfil del usuario.' });
    }
});

// Endpoint para actualizar el perfil de un usuario
app.put('/api/perfil', async (req, res) => {
    try {
        const { correo, tarjeta, fotoPerfil, ...datosActualizados } = req.body;

        if (!correo) {
            return res.status(400).json({ error: 'El correo es obligatorio' });
        }

        // Buscar el usuario actual para manejar la foto de perfil
        const usuarioActual = await Usuario.findOne({ correo });
        if (!usuarioActual) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Manejar eliminación de foto de perfil
        if (fotoPerfil === "" && usuarioActual.fotoPerfil) {
            // Eliminar archivo físico de la foto anterior
            const rutaAnterior = path.join(__dirname, 'public', usuarioActual.fotoPerfil);
            if (fs.existsSync(rutaAnterior)) {
                try {
                    fs.unlinkSync(rutaAnterior);
                    console.log(`Archivo de foto eliminado: ${usuarioActual.fotoPerfil}`);
                } catch (error) {
                    console.error('Error al eliminar archivo de foto:', error);
                }
            }
            datosActualizados.fotoPerfil = "";
        } else if (fotoPerfil !== undefined) {
            datosActualizados.fotoPerfil = fotoPerfil;
        }

        if (tarjeta && Array.isArray(tarjeta)) {
            datosActualizados.tarjeta = tarjeta.map(t => ({
                Titular: t.Titular,
                Numero: t.Numero,
                CVC: t.CVC,
                FechaVencimiento: t.FechaVencimiento
            }));
        }

        const usuario = await Usuario.findOneAndUpdate(
            { correo },
            { $set: datosActualizados },
            { new: true }
        );

        res.status(200).json({ message: 'Perfil actualizado exitosamente'});
    } catch (error) {
        console.log('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.', detalles: error.message });
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
    }
});
//endpoint para actualizar el rol de un usuario
app.put('/api/usuarios/:correo/rol', async (req, res) => {
    try {
        const { correo } = req.params;
        const { rol } = req.body;

        if (!correo || !rol) {
            return res.status(400).json({ error: 'Correo y rol son obligatorios.' });
        }

        const usuario = await Usuario.findOneAndUpdate(
            { correo },
            { $set: { rol } },
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Rol actualizado exitosamente.', usuario });
    } catch (error) {
        console.error('Error al actualizar el rol:', error);
        res.status(500).json({ error: 'Error al actualizar el rol.' });
    }
});

// Endpoint para actualizar el carrito de un usuario


// Ruta para registrar una compra
app.post('/api/usuarios/:correo/compras', async (req, res) => {
    try {
        const { correo } = req.params;
        const { compra } = req.body;

        if (!correo || !compra) {
            return res.status(400).json({ error: 'Correo y datos de la compra son obligatorios.' });
        }

        const usuario = await Usuario.findOneAndUpdate(
            { correo },
            { $push: { registroCompras: compra } },
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Compra registrada exitosamente.', registroCompras: usuario.registroCompra});
    } catch (error) {
        console.error('Error al registrar la compra:', error);
        res.status(500).json({ error: 'Error al registrar la compra.' });
    }
});

// Endpoint para obtener el carrito de un usuario
app.get('/api/usuarios/:correo/carrito', async (req, res) => {
    try {
        const { correo } = req.params;

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json(usuario.carrito);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
});

// Endpoint para actualizar el carrito de un usuario
app.put('/api/usuarios/:correo/carrito', async (req, res) => {
    try {
        const { correo } = req.params;
        const { carrito } = req.body;

        if (!correo || !carrito) {
            return res.status(400).json({ error: 'Correo y carrito son obligatorios.' });
        }

        const usuario = await Usuario.findOneAndUpdate(
            { correo },
            { $set: { carrito } },
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Carrito actualizado exitosamente.', carrito: usuario.carrito });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito.' });
    }
});

// Endpoint para eliminar un producto del carrito de un usuario
app.delete('/api/usuarios/:correo/carrito/:idProducto', async (req, res) => {
    try {
        const { correo, idProducto } = req.params;

        if (!correo || !idProducto) {
            return res.status(400).json({ error: 'Correo e ID del producto son obligatorios.' });
        }

        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        usuario.carrito = usuario.carrito.filter(item => item.id !== parseInt(idProducto, 10));
        await usuario.save();

        res.status(200).json({ message: 'Producto eliminado del carrito.', carrito: usuario.carrito });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
    }
});

// Ruta para guardar mensajes
app.post('/api/mensajes', async (req, res) => {
    try {
        const { Nombre, Correo, Mensaje: MensajeTexto } = req.body;
        const nuevoMensaje = new Mensaje({ Nombre, Correo, Mensaje: MensajeTexto });
        await nuevoMensaje.save();
        res.status(201).send({ message: 'Mensaje guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).send({ error: 'Error al guardar el mensaje' });
    }
});

// Ruta para obtener todos los mensajes
app.get('/api/mensajes', async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        res.status(200).json(mensajes);
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).send({ error: 'Error al obtener los mensajes' });
    }
});

// Endpoint para responder a un mensaje
app.post('/api/mensajes/:id/responder', async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta } = req.body;

        if (!respuesta || respuesta.trim() === '') {
            return res.status(400).json({ error: 'La respuesta no puede estar vacía.' });
        }

        const mensaje = await Mensaje.findByIdAndUpdate(
            id,
            { Respuesta: respuesta },
            { new: true }
        );

        if (!mensaje) {
            return res.status(404).json({ error: 'Mensaje no encontrado.' });
        }

        res.status(200).json({ message: 'Respuesta guardada exitosamente.', mensaje });
    } catch (error) {
        console.error('Error al responder el mensaje:', error);
        res.status(500).json({ error: 'Error al responder el mensaje.' });
    }
});

// Endpoint para obtener los datos de "Sobre Nosotros"
app.get('/api/sobre-nosotros', async (req, res) => {
    try {
        const companyInfo = await CompanyInfo.find(); // Obtener todos los documentos
        if (!companyInfo || companyInfo.length === 0) {
            return res.status(404).json({ error: 'Información no encontrada.' });
        }
        res.status(200).json(companyInfo); // Enviar el objeto directamente
    } catch (error) {
        console.error('Error al obtener la información de "Sobre Nosotros":', error);
        res.status(500).json({ error: 'Error al obtener la información.' });
    }
});

// Endpoint para actualizar o crear "Sobre Nosotros"
app.put('/api/sobre-nosotros', async (req, res) => {
    try {
        const { id, descripcion, nombres, apellidos, correo, telefono, foto } = req.body;
        console.log('Datos recibidos:', req.body); // Log para depuración

        // Validar que los campos requeridos no sean nulos o vacíos
        if (!descripcion || !nombres || !apellidos || !correo || !telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        let updatedInfo;
        if (id) {
            // Actualizar un miembro existente
            updatedInfo = await CompanyInfo.findByIdAndUpdate(
                id,
                { descripcion, nombres, apellidos, correo, telefono, foto },
                { new: true }
            );
        } else {
            // Crear un nuevo miembro
            const newMember = new CompanyInfo({ descripcion, nombres, apellidos, correo, telefono, foto });
            updatedInfo = await newMember.save();
        }

        res.status(200).json({ message: 'Información actualizada exitosamente.', updatedInfo });
    } catch (error) {
        console.error('Error al actualizar la información de "Sobre Nosotros":', error);
        res.status(500).json({ error: 'Error al actualizar la información.' });
    }
});

// Ruta para guardar datos del equipo
app.post('/api/sobre-nosotros', uploadSobreNosotros.single('foto'), async (req, res) => {
    try {
        const { Id, Descripcion, Nombres, Apellidos, Correo, Telefono, fotoExistente } = req.body;
        
        let foto;
        if (req.file) {
            // Si se subió una nueva imagen, usar la nueva
            foto = `/img/${req.file.filename}`;
        } else if (fotoExistente && fotoExistente !== 'undefined') {
            // Si no hay nueva imagen pero hay una existente enviada desde el frontend, mantener la existente
            foto = fotoExistente;
        } else if (req.body.foto && req.body.foto !== 'undefined') {
            // Mantener compatibilidad con el campo foto anterior
            foto = req.body.foto;
        } else {
            // Si no hay imagen, usar la por defecto
            foto = '/img/default.jpg';
        }

        console.log('Datos recibidos:', { Id, Descripcion, Nombres, Apellidos, Correo, Telefono, Foto: foto, fotoExistente });

        // Validar que los campos requeridos no sean nulos o vacíos
        if (!Descripcion || !Nombres || !Apellidos || !Correo || !Telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        let updatedMember;
        if (Id) {
            // Buscar y actualizar por el campo Id en lugar de _id
            updatedMember = await CompanyInfo.findOneAndUpdate(
                { Id },
                { Descripcion, Nombres, Apellidos, Correo, Telefono, Foto: foto },
                { new: true }
            );

            if (!updatedMember) {
                return res.status(404).json({ error: 'Miembro no encontrado.' });
            }
        } else {
            // Crear un nuevo miembro con Id incremental
            const lastMember = await CompanyInfo.findOne().sort({ Id: -1 });

            const newId = lastMember ? lastMember.Id + 1 : 1;
            const newMember = new CompanyInfo({
                Id: newId,
                Descripcion,
                Nombres,
                Apellidos,
                Correo,
                Telefono,
                Foto: foto
            });

            updatedMember = await newMember.save();
        }

        res.status(200).json({ message: 'Datos guardados exitosamente.', updatedMember });

    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ error: 'Error al guardar los datos del equipo.' });
    }
});

// Endpoint para eliminar un miembro del equipo
app.delete('/api/sobre-nosotros/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Busca y elimina el miembro por su ID
        const deletedMember = await CompanyInfo.findOneAndDelete({ Id: id }); // Buscar y eliminar por el campo Id en lugar de _id

        if (!deletedMember) {
            return res.status(404).json({ error: 'Miembro no encontrado.' });
        }

        res.status(200).json({ message: 'Miembro eliminado exitosamente.', deletedMember });
    } catch (error) {
        console.error('Error al eliminar el miembro:', error);
        res.status(500).json({ error: 'Error al eliminar el miembro.' });
    }
});

// Endpoint para obtener los datos de "Términos y Condiciones"
app.get('/api/terminos-condiciones', async (req, res) => {
    try {
        const terms = await TermsAndConditions.find();
        res.status(200).json(terms);
    } catch (error) {
        console.error('Error al obtener los términos y condiciones:', error);
        res.status(500).json({ error: 'Error al obtener los términos y condiciones.' });
    }
});

// Endpoint para actualizar o crear "Términos y Condiciones"
app.put('/api/terminos-condiciones', async (req, res) => {
    try {
        const { titulo, contenido, modificadoPor } = req.body;

        const updatedTerms = await TermsAndConditions.findOneAndUpdate(
            {id},
            { titulo, contenido, ultimaModificacion: Date.now(), modificadoPor },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: 'Términos y condiciones actualizados exitosamente.', updatedTerms });
    } catch (error) {
        console.error('Error al actualizar los términos y condiciones:', error);
        res.status(500).json({ error: 'Error al actualizar los términos y condiciones.' });
    }
});

app.post('/api/terminos-condiciones', async (req, res) => {
    try {
        const { id, titulo, contenido, modificadoPor } = req.body;
        console.log('Datos recibidos:', req.body); // Log para depuración
        let updatedTerm;
        if (id && id !== 'undefined') {
            // Actualizar un término existente por el campo id
            updatedTerm = await TermsAndConditions.findOneAndUpdate(
                { id },
                { titulo, contenido, ultimaModificacion: Date.now(), modificadoPor },
                { new: true }
            );
        } else {
            // Crear un nuevo término con un id único
            const lastTerm = await TermsAndConditions.findOne().sort({ id: -1 });
            const newId = lastTerm ? parseInt(lastTerm.id, 10) + 1 : 1;

            updatedTerm = new TermsAndConditions({
                id: newId.toString(),
                titulo,
                contenido,
                ultimaModificacion: Date.now(),
                modificadoPor
            });
            await updatedTerm.save();
        }

        res.status(200).json({ message: 'Término guardado exitosamente.', updatedTerm });
    } catch (error) {
        console.error('Error al guardar el término:', error);
        res.status(500).json({ error: 'Error al guardar el término.' });
    }
});

app.delete('/api/terminos-condiciones/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTerm = await TermsAndConditions.findOneAndDelete({ id }); // Buscar y eliminar por el campo id en lugar de _id

        if (!deletedTerm) {
            return res.status(404).json({ error: 'Término no encontrado.' });
        }

        res.status(200).json({ message: 'Término eliminado exitosamente.', deletedTerm });
    } catch (error) {
        console.error('Error al eliminar el término:', error);
        res.status(500).json({ error: 'Error al eliminar el término.' });
    }
});

// Endpoints para Monedas
app.get('/api/monedas', async (req, res) => {
    try {
        const monedas = await Moneda.find();
        res.status(200).json(monedas);
    } catch (error) {
        console.error('Error al obtener las monedas:', error);
        res.status(500).json({ error: 'Error al obtener las monedas.' });
    }
});

app.put('/api/monedas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const moneda = await Moneda.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!moneda) {
            return res.status(404).json({ error: 'Moneda no encontrada.' });
        }

        res.status(200).json({ message: 'Moneda actualizada exitosamente.', moneda });
    } catch (error) {
        console.error('Error al actualizar la moneda:', error);
        res.status(500).json({ error: 'Error al actualizar la moneda.' });
    }
});

app.post('/api/monedas', async (req, res) => {
    try {
        const { moneda, nombre, valor_en_usd } = req.body;
        const nuevaMoneda = new Moneda({ moneda, nombre, valor_en_usd });
        await nuevaMoneda.save();
        res.status(201).json(nuevaMoneda);
    } catch (error) {
        console.error('Error al crear la moneda:', error);
        res.status(500).json({ error: 'Error al crear la moneda.' });
    }
}
);

app.delete('/api/monedas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const moneda = await Moneda.findByIdAndDelete(id);
        if (!moneda) {
            return res.status(404).json({ error: 'Moneda no encontrada.' });
        }
        // Actualizar productos con esa moneda
        await Producto.updateMany(
            { moneda: moneda.moneda },
            { $set: { moneda: 'USD' } }
        );
        res.status(200).json({ message: 'Moneda eliminada exitosamente.', moneda });
    } catch (error) {
        console.error('Error al eliminar la moneda:', error);
        res.status(500).json({ error: 'Error al eliminar la moneda.' });
    }
});



// Endpoints para Ubicaciones
// Obtener todas las ubicaciones
app.get('/api/ubicaciones', async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.find();
        res.status(200).json(ubicaciones);
    } catch (error) {
        console.error('Error al obtener las ubicaciones:', error);
        res.status(500).json({ error: 'Error al obtener las ubicaciones.' });
    }
});

// Crear nueva ubicación (país, departamento, ciudad)
app.post('/api/ubicaciones', async (req, res) => {
    try {
        const { pais, departamento, ciudad } = req.body;
        if (!pais || !departamento || !ciudad) {
            return res.status(400).json({ error: 'País, departamento y ciudad son obligatorios.' });
        }
        let ubicacion = await Ubicacion.findOne({ nombre: pais });
        if (!ubicacion) {
            // Crear país con departamento y ciudad
            ubicacion = new Ubicacion({
                nombre: pais,
                departamentos: [{ nombre: departamento, ciudades: [{ nombre: ciudad }] }]
            });
            await ubicacion.save();
            return res.status(201).json({ message: 'Ubicación creada correctamente.' });
        }
        // Buscar departamento
        let depto = ubicacion.departamentos.find(d => d.nombre === departamento);
        if (!depto) {
            // Agregar departamento con ciudad
            ubicacion.departamentos.push({ nombre: departamento, ciudades: [{ nombre: ciudad }] });
            await ubicacion.save();
            return res.status(201).json({ message: 'Departamento y ciudad agregados correctamente.' });
        }
        // Buscar ciudad
        let ciudadExistente = depto.ciudades.find(c => c.nombre === ciudad);
        if (!ciudadExistente) {
            depto.ciudades.push({ nombre: ciudad });
            await ubicacion.save();
            return res.status(201).json({ message: 'Ciudad agregada correctamente.' });
        }
        res.status(200).json({ message: 'La ubicación ya existe.' });
    } catch (error) {
        console.error('Error al crear la ubicación:', error);
        res.status(500).json({ error: 'Error al crear la ubicación.' });
    }
});

// Eliminar país
app.delete('/api/ubicaciones/:paisId', async (req, res) => {
    try {
        await Ubicacion.findByIdAndDelete(req.params.paisId);
        res.json({ message: 'País eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el país.' });
    }
});

// Endpoint unificado para eliminar ciudad, departamento o país según la cascada
app.delete('/api/ubicaciones/:paisId/departamento/:departamentoNombre/ciudad/:ciudadNombre', async (req, res) => {
    try {
        const { paisId, departamentoNombre, ciudadNombre } = req.params;
        const pais = await Ubicacion.findById(paisId);
        if (!pais) {
            return res.status(404).json({ error: 'País no encontrado.' });
        }
        const departamento = pais.departamentos.find(d => d.nombre === departamentoNombre);
        if (!departamento) {
            return res.status(404).json({ error: 'Departamento no encontrado.' });
        }
        // Eliminar la ciudad
        departamento.ciudades = departamento.ciudades.filter(c => c.nombre !== ciudadNombre);
        // Si el departamento queda sin ciudades, eliminar el departamento
        if (departamento.ciudades.length === 0) {
            pais.departamentos = pais.departamentos.filter(d => d.nombre !== departamentoNombre);
        }
        // Si el país queda sin departamentos, eliminar el país
        if (pais.departamentos.length === 0) {
            await pais.remove();
            return res.json({ message: 'País, departamento y ciudad eliminados.' });
        } else {
            await pais.save();
            if (!pais.departamentos.find(d => d.nombre === departamentoNombre)) {
                return res.json({ message: 'Departamento y ciudad eliminados.' });
            } else {
                return res.json({ message: 'Ciudad eliminada.' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la ubicación.' });
    }
});

// Rutas para gestionar categorías
app.get('/api/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías.' });
    }
});

app.post('/api/categorias', async (req, res) => {
    try {
        const { nombre } = req.body;
        const nuevaCategoria = new Categoria({
            id: uuidv4(), // Generate a unique ID for the category
            nombre
        });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ error: 'Error al crear la categoría.' });
    }
});

app.put('/api/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { nombre }, { new: true });
        res.status(200).json(categoriaActualizada);
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).json({ error: 'Error al actualizar la categoría.' });
    }
});

// Al eliminar una categoría, actualizar productos con esa categoría a 'Sin categoría'
app.delete('/api/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Intentar eliminar por el campo "id" personalizado
        const categoria = await Categoria.findOneAndDelete({ id });
        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada.' });
        }
        // Actualizar productos con esa categoría
        await Producto.updateMany(
            { categoria: categoria.nombre },
            { $set: { categoria: 'Sin categoría' } }
        );
        res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error al eliminar la categoría.' });
    }
});

// Endpoint para procesar el pago
app.post('/api/pagar', async (req, res) => {
    const { correo, carrito, direccion, tarjeta } = req.body;
    if (!correo || !carrito || carrito.length === 0 || !direccion || !tarjeta) {
        return res.status(400).json({ error: 'Correo, carrito, dirección y método de pago son obligatorios.' });
    }

    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const registroCompra = usuario.registroCompra || [];

        // Generar un código de factura único
        const codigoFactura = `FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        for (const item of carrito) {
            const producto = await Producto.findOne({ id: item.id });
            if (!producto) {
                return res.status(404).json({ error: `Producto con ID ${item.id} no encontrado.` });
            }

            if (item.cantidad > producto.stock) {
                return res.status(400).json({ error: `Stock insuficiente para el producto: ${producto.nombre}.` });
            }

            // Reducir el stock del producto
            producto.stock -= item.cantidad;
            await producto.save();

            // Registrar la compra con el código de factura
            registroCompra.push({
                id: producto.id,
                nombre: producto.nombre,
                cantidad: item.cantidad,
                precio: producto.precio,
                fecha: new Date().toISOString(),
                factura: codigoFactura,
                direccion,
                tarjeta
            });

            // Eliminar este producto del carrito del usuario
            usuario.carrito = usuario.carrito.filter(c => c.id !== item.id);
            console.log(usuario.carrito);
        }

        // Actualizar el registro de compras del usuario
        usuario.registroCompra = registroCompra;
        await usuario.save();

        res.status(200).json({
            message: 'Pago procesado con éxito.',
            factura: codigoFactura,
            carrito: usuario.carrito,
            registroCompras: usuario.registroCompra
        });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).json({ error: 'Hubo un error al procesar el pago.' });
    }
});

app.get('/api/usuarios/:correo', async (req, res) => {
    const { correo } = req.params;
    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al obtener el usuario.' });
    }
});

// Endpoint para obtener el registro de compras de un usuario
app.get('/api/usuarios/:correo/compras', async (req, res) => {
    const { correo } = req.params;
    const { factura } = req.query;

    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        let registroCompras = usuario.registroCompra || [];

        // Filtrar por número de factura si se proporciona
        if (factura) {
            registroCompras = registroCompras.filter(compra => compra.factura === factura);
        }

        res.status(200).json(registroCompras);
    } catch (error) {
        console.error('Error al obtener las compras del usuario:', error);
        res.status(500).json({ error: 'Hubo un error al obtener las compras del usuario.' });
    }
});

// Endpoint to get all social media links
app.get('/api/redes-sociales', async (req, res) => {
    try {
        const redes = await RedSocial.find();
        res.status(200).json(redes);
    } catch (error) {
        console.error('Error fetching social media links:', error);
        res.status(500).json({ error: 'Error fetching social media links.' });
    }
});

// Endpoint to add a new social media link
app.post('/api/redes-sociales', async (req, res) => {
    try {
        const { nombre, enlace, id } = req.body;

        if (!nombre || !enlace) {
            return res.status(400).json({ error: 'Both name and link are required.' });
        }

        const nuevaRed = new RedSocial({ nombre, enlace, id });
        await nuevaRed.save();
        res.status(201).json({ message: 'Social media link added successfully.', nuevaRed });
    } catch (error) {
        console.error('Error adding social media link:', error);
        res.status(500).json({ error: 'Error adding social media link.' });
    }
});

// Endpoint to update a social media link
app.put('/api/redes-sociales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, enlace } = req.body;

        if (!nombre || !enlace) {
            return res.status(400).json({ error: 'Both name and link are required.' });
        }

        const redSocialActualizada = await RedSocial.findByIdAndUpdate(id, { nombre, enlace }, { new: true });

        if (!redSocialActualizada) {
            return res.status(404).json({ error: 'Social media link not found.' });
        }

        res.status(200).json({ message: 'Social media link updated successfully.', redSocialActualizada });
    } catch (error) {
        console.error('Error updating social media link:', error);
        res.status(500).json({ error: 'Error updating social media link.' });
    }
});

// Endpoint to delete a social media link
app.delete('/api/redes-sociales/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const redSocialEliminada = await RedSocial.findByIdAndDelete(id);

        if (!redSocialEliminada) {
            return res.status(404).json({ error: 'Social media link not found.' });
        }

        res.status(200).json({ message: 'Social media link deleted successfully.', redSocialEliminada });
    } catch (error) {
        console.error('Error deleting social media link:', error);
        res.status(500).json({ error: 'Error deleting social media link.' });
    }
});

// ===== RUTAS PARA GESTIÓN DE TEMAS =====

// Obtener todos los temas
app.get('/api/temas', async (req, res) => {
    try {
        const temas = await Tema.find().sort({ orden: 1, nombre: 1 });
        res.json(temas);
    } catch (error) {
        console.error('Error al obtener temas:', error);
        res.status(500).json({ error: 'Error al obtener los temas' });
    }
});

// Obtener un tema específico
app.get('/api/temas/:id', async (req, res) => {
    try {
        console.log('📋 [API] GET /api/temas/:id - ID recibido:', req.params.id);
        
        // Validar que el ID sea un ObjectId válido
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('❌ [API] ID no es válido ObjectId:', req.params.id);
            return res.status(400).json({ error: 'ID de tema no válido' });
        }
        
        const tema = await Tema.findById(req.params.id);
        if (!tema) {
            console.log('❌ [API] Tema no encontrado con ID:', req.params.id);
            return res.status(404).json({ error: 'Tema no encontrado' });
        }
        
        console.log('✅ [API] Tema encontrado:', tema.nombre);
        res.json(tema);
    } catch (error) {
        console.error('❌ [API] Error al obtener tema:', error);
        res.status(500).json({ error: 'Error al obtener el tema' });
    }
});

// Crear un nuevo tema
app.post('/api/temas', async (req, res) => {
    try {
        const { nombre, emoji, colores } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre del tema es requerido' });
        }

        // Verificar que el nombre no esté duplicado
        const temaExistente = await Tema.findOne({ nombre });
        if (temaExistente) {
            return res.status(400).json({ error: 'Ya existe un tema con ese nombre' });
        }

        const nuevoTema = new Tema({
            nombre,
            emoji: emoji || '🎨',
            colores: colores || {}
        });

        await nuevoTema.save();
        res.status(201).json(nuevoTema);
    } catch (error) {
        console.error('Error al crear tema:', error);
        res.status(500).json({ error: 'Error al crear el tema' });
    }
});

// Actualizar un tema
app.put('/api/temas/:id', async (req, res) => {
    try {
        console.log('🔄 [API] PUT /api/temas/:id - ID recibido:', req.params.id);
        console.log('📝 [API] Body recibido:', req.body);
        
        // Validar que el ID sea un ObjectId válido
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('❌ [API] ID no es válido ObjectId:', req.params.id);
            return res.status(400).json({ error: 'ID de tema no válido' });
        }
        
        const { nombre, colores } = req.body;
        
        const tema = await Tema.findById(req.params.id);
        if (!tema) {
            console.log('❌ [API] Tema no encontrado con ID:', req.params.id);
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        // ⛔ VERIFICAR SI EL TEMA ESTÁ PROTEGIDO
        if (tema.protegido) {
            console.log('🔒 [API] Intento de editar tema protegido:', tema.nombre);
            return res.status(403).json({ 
                error: 'Este tema está protegido y no puede ser modificado',
                temaProtegido: true,
                nombre: tema.nombre
            });
        }

        console.log('📋 [API] Tema encontrado:', tema.nombre);

        // Si se cambia el nombre, verificar que no esté duplicado
        if (nombre && nombre !== tema.nombre) {
            const temaExistente = await Tema.findOne({ nombre });
            if (temaExistente) {
                return res.status(400).json({ error: 'Ya existe un tema con ese nombre' });
            }
            tema.nombre = nombre;
        }

        if (colores) {
            console.log('🎨 [API] Actualizando colores del tema');
            tema.colores = { ...tema.colores, ...colores };
        }

        await tema.save();
        console.log('✅ [API] Tema actualizado exitosamente');
        res.json(tema);
    } catch (error) {
        console.error('❌ [API] Error al actualizar tema:', error);
        res.status(500).json({ error: 'Error al actualizar el tema' });
    }
});

// Eliminar un tema
app.delete('/api/temas/:id', async (req, res) => {
    try {
        const tema = await Tema.findById(req.params.id);
        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        // ⛔ VERIFICAR SI EL TEMA ESTÁ PROTEGIDO
        if (tema.protegido) {
            console.log('🔒 [API] Intento de eliminar tema protegido:', tema.nombre);
            return res.status(403).json({ 
                error: 'Este tema está protegido y no puede ser eliminado',
                temaProtegido: true,
                nombre: tema.nombre
            });
        }

        await Tema.findByIdAndDelete(req.params.id);
        console.log('🗑️ [API] Tema eliminado exitosamente:', tema.nombre);
        res.json({ message: 'Tema eliminado exitosamente' });
    } catch (error) {
        console.error('❌ [API] Error al eliminar tema:', error);
        res.status(500).json({ error: 'Error al eliminar el tema' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// --- Crear carpeta y archivo de ubicación del mapa al iniciar el servidor ---
const ubicacionMapaPath = path.join(__dirname, 'data', 'ubicacionMapa.json');
const ubicacionMapaDir = path.dirname(ubicacionMapaPath);
if (!fs.existsSync(ubicacionMapaDir)) {
    fs.mkdirSync(ubicacionMapaDir, { recursive: true });
}
if (!fs.existsSync(ubicacionMapaPath)) {
    fs.writeFileSync(ubicacionMapaPath, JSON.stringify({ html: '' }), 'utf-8');
}

// --- API para ubicación del mapa (footer) ---
app.get('/api/ubicacion-mapa', (req, res) => {
    try {
        if (!fs.existsSync(ubicacionMapaPath)) {
            return res.status(200).json({ html: '' });
        }
        const data = fs.readFileSync(ubicacionMapaPath, 'utf-8');
        const json = JSON.parse(data);
        res.status(200).json(json);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer la ubicación del mapa.' });
    }
});

// Guardar la ubicación del mapa
app.post('/api/ubicacion-mapa', (req, res) => {
    try {
        const { html } = req.body;
        // Crear la carpeta data si no existe
        const dir = path.dirname(ubicacionMapaPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(ubicacionMapaPath, JSON.stringify({ html }), 'utf-8');
        res.status(200).json({ message: 'Ubicación del mapa guardada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la ubicación del mapa.' });
    }
});

//obtener el json del mapa
app.get('/api/ubicacion-mapa', (req, res) => {
    try {
        if (!fs.existsSync(ubicacionMapaPath)) {
            return res.status(200).json({ html: '' });
        }
        const data = fs.readFileSync(ubicacionMapaPath, 'utf-8');
        const json = JSON.parse(data);
        res.status(200).json(json);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer la ubicación del mapa.' });
    }
});

// --- API para Historia (Sobre Nosotros) ---
const historiaPath = path.join(__dirname, 'data', 'Historia.json');

// Obtener la historia
app.get('/api/historia', (req, res) => {
    try {
        if (!fs.existsSync(historiaPath)) {
            return res.status(200).json({ historia: '' });
        }
        const data = fs.readFileSync(historiaPath, 'utf-8');
        const json = JSON.parse(data);
        res.status(200).json(json);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer la historia.' });
    }
});

// Guardar la historia
app.post('/api/historia', (req, res) => {
    try {
        const { historia } = req.body;
        const dir = path.dirname(historiaPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(historiaPath, JSON.stringify({ historia }), 'utf-8');
        res.status(200).json({ message: 'Historia guardada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la historia.' });
    }
});

// Función para enviar correo de recuperación
async function enviarCorreoRecuperacion(destinatario, token, req) {    // Configuración del transporter de email
    const emailConfig = isProduction ? {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    } : {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'pawmarket@gmail.com',
            pass: process.env.EMAIL_PASS // Usar variables de entorno también para desarrollo
        }
    };
    
    let transporter = nodemailer.createTransport(emailConfig);

    // Usar BASE_URL de entorno o derivar del request
    const baseUrl = process.env.BASE_URL || (req ? `${req.protocol}://${req.get('host')}` : '');
    const enlace = `${baseUrl}/restablecer-contrasena/${token}`;
    let mailOptions = {
        from: process.env.EMAIL_USER || 'pawmarket@gmail.com',
        to: destinatario,
        subject: 'Recuperación de contraseña - PawMarket',
        html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperación de Contraseña</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        line-height: 1.6;
                        color: #2c2c2c;
                        background-color: #fff5e6;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: #ffffff;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                        padding: 40px 30px;
                        text-align: center;
                        color: white;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .header p {
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .security-alert {
                        background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
                        border: 2px solid #ffc107;
                        border-radius: 12px;
                        padding: 25px;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .security-icon {
                        font-size: 48px;
                        margin-bottom: 15px;
                        display: block;
                    }
                    .security-title {
                        font-size: 20px;
                        font-weight: 600;
                        color: #856404;
                        margin-bottom: 10px;
                    }
                    .security-subtitle {
                        color: #856404;
                        font-size: 16px;
                    }
                    .reset-section {
                        text-align: center;
                        margin: 40px 0;
                    }
                    .reset-title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #2c2c2c;
                        margin-bottom: 15px;
                    }
                    .reset-subtitle {
                        font-size: 16px;
                        color: #555555;
                        margin-bottom: 30px;
                    }
                    .btn-reset {
                        display: inline-block;
                        background: linear-gradient(135deg, #e6a300 0%, #d49000 100%);
                        color: white;
                        text-decoration: none;
                        padding: 18px 36px;
                        border-radius: 10px;
                        font-weight: 600;
                        font-size: 18px;
                        transition: all 0.3s ease;
                        box-shadow: 0 6px 20px rgba(230, 163, 0, 0.3);
                        border: none;
                        cursor: pointer;
                    }
                    .btn-reset:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 25px rgba(230, 163, 0, 0.4);
                    }
                    .timer-box {
                        background: linear-gradient(135deg, #fff5e6 0%, #ffffff 100%);
                        border: 2px solid #e6a300;
                        border-radius: 12px;
                        padding: 25px;
                        text-align: center;
                        margin: 30px 0;
                    }
                    .timer-icon {
                        font-size: 40px;
                        margin-bottom: 15px;
                        display: block;
                    }
                    .timer-text {
                        color: #d49000;
                        font-weight: 600;
                        font-size: 16px;
                    }
                    .info-section {
                        background: #ffffff;
                        border-left: 4px solid #e6a300;
                        padding: 20px;
                        margin: 30px 0;
                        border-radius: 0 8px 8px 0;
                        border: 1px solid #ddd;
                    }
                    .info-section h3 {
                        color: #2c2c2c;
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }
                    .info-section p {
                        color: #555555;
                        font-size: 14px;
                        margin: 0;
                    }
                    .security-tips {
                        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                        border: 2px solid #28a745;
                        border-radius: 12px;
                        padding: 25px;
                        margin: 30px 0;
                        color: white;
                    }
                    .security-tips h3 {
                        color: white;
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 15px;
                    }
                    .security-tips ul {
                        color: white;
                        font-size: 14px;
                        margin-left: 20px;
                    }
                    .security-tips li {
                        margin-bottom: 8px;
                    }
                    .footer {
                        background: #fff5e6;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #ddd;
                    }
                    .footer-text {
                        color: #555555;
                        font-size: 14px;
                        margin-bottom: 15px;
                    }
                    .social-links {
                        margin: 20px 0;
                    }
                    .social-link {
                        display: inline-block;
                        margin: 0 8px;
                        color: #d49000;
                        text-decoration: none;
                        font-size: 24px;
                        transition: transform 0.2s ease;
                    }
                    .social-link:hover {
                        transform: scale(1.2);
                    }
                    .divider {
                        height: 1px;
                        background: linear-gradient(90deg, transparent, #ddd, transparent);
                        margin: 30px 0;
                    }
                    @media (max-width: 600px) {
                        .email-container {
                            margin: 20px;
                            border-radius: 12px;
                        }
                        .header {
                            padding: 30px 20px;
                        }
                        .content {
                            padding: 30px 20px;
                        }
                        .btn-reset {
                            font-size: 16px;
                            padding: 16px 28px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>🐾 PawMarket 🐾</h1>
                        <p>Tu marketplace de mascotas favorito</p>
                    </div>
                    
                    <div class="content">
                        <div class="security-alert">
                            <span class="security-icon">🔐</span>
                            <h2 class="security-title">Solicitud de Recuperación</h2>
                            <p class="security-subtitle">Hemos recibido una solicitud para restablecer tu contraseña</p>
                        </div>

                        <div class="reset-section">
                            <h2 class="reset-title">Restablece tu contraseña</h2>
                            <p class="reset-subtitle">Haz clic en el botón de abajo para crear una nueva contraseña segura</p>
                            
                            <a href="${enlace}" class="btn-reset">🔑 Restablecer Contraseña</a>
                        </div>

                        <div class="timer-box">
                            <span class="timer-icon">⏰</span>
                            <p class="timer-text">Este enlace expira en 1 hora por tu seguridad</p>
                        </div>

                        <div class="divider"></div>

                        <div class="security-tips">
                            <h3>🛡️ Consejos de Seguridad</h3>
                            <ul>
                                <li>Usa una contraseña única y fuerte (mínimo 8 caracteres)</li>
                                <li>Combina letras mayúsculas, minúsculas, números y símbolos</li>
                                <li>No compartas tu contraseña con nadie</li>
                                <li>Activa la verificación en dos pasos si está disponible</li>
                            </ul>
                        </div>

                        <div class="info-section">
                            <h3>🚫 ¿No solicitaste esto?</h3>
                            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu cuenta permanece protegida.</p>
                        </div>

                        <div class="info-section">
                            <h3>🆘 ¿Necesitas ayuda?</h3>
                            <p>Si tienes problemas o sospechas de actividad no autorizada, contacta inmediatamente a nuestro equipo de soporte.</p>
                        </div>
                    </div>

                    <div class="footer">
                        <p class="footer-text">© 2025 PawMarket. Todos los derechos reservados.</p>
                        
                        <div class="social-links">
                            <a href="#" class="social-link">📧</a>
                            <a href="#" class="social-link">📱</a>
                            <a href="#" class="social-link">🌐</a>
                            <a href="#" class="social-link">📞</a>
                        </div>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">
                            Este es un correo automático, por favor no respondas a esta dirección.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    await transporter.sendMail(mailOptions);
}


// Endpoint para solicitar recuperación de contraseña
app.post('/api/recuperar-contrasena', authLimiter, async (req, res) => {
    try {
        const { correo } = req.body;
        if (!correo) {
            return res.status(400).json({ error: 'El correo es obligatorio.' });
        }
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'No existe una cuenta con ese correo.' });
        }
        // Generar un token simple (en producción usa JWT o uuid)
        const token = Math.random().toString(36).substr(2);
        usuario.token = token;
        usuario.tokenExpira = Date.now() + 3600000; // Expira en 1 hora
        await usuario.save();
        await enviarCorreoRecuperacion(usuario.correo, token, req);
        return res.status(200).json({ message: 'Revisa tu correo electronico para continuar.' });
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud de recuperación.' });
    }
});

// Endpoint para restablecer la contraseña con token (con rate limiting estricto)
app.post('/api/restablecer-contrasena', authLimiter, async (req, res) => {
    try {
        const { token, nuevaContrasena } = req.body;
        if (!token || !nuevaContrasena) {
            return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios.' });
        }
        // Buscar usuario con ese token
        const usuario = await Usuario.findOne({ token: token });
        if (!usuario || !usuario.tokenExpira || usuario.tokenExpira < Date.now()) {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }
        
        // Cifrar la nueva contraseña antes de guardarla
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(nuevaContrasena, saltRounds);
        
        usuario.contrasena = hashedPassword; // Guardar la contraseña cifrada
        usuario.token = undefined; // Eliminar el token para que no se reutilice
        usuario.tokenExpira = undefined;
        await usuario.save();
        res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
});


// --- API para gestionar IPs permitidas ---
// Obtener todas las IPs permitidas
app.get('/api/ips/:ip', async (req, res) => {
    try {
        const { ip } = req.params;
        const ips = await IPPermitida.findOne({ direccionIP: ip });
        if (!ips) {
            return res.status(404).json({ error: 'IP no encontrada.' });
        }else{
            res.status(200).json(ips);
        }
    } catch (error) {
        console.error('Error al obtener las IPs permitidas:', error);
        res.status(500).json({ error: 'Error al obtener las IPs permitidas.' });
    }
});

// Obtener todas las IPs permitidas
app.get('/api/ips', async (req, res) => {
    try {
        const ips = await IPPermitida.find();
        res.status(200).json(ips);
    } catch (error) {
        console.error('Error al obtener las IPs permitidas:', error);
        res.status(500).json({ error: 'Error al obtener las IPs permitidas.' });
    }
});

// Agregar una nueva IP permitida
app.post('/api/ips', async (req, res) => {
    try {
        const { direccionIP, descripcion } = req.body;
        if (!direccionIP) {
            return res.status(400).json({ error: 'La dirección IP es obligatoria.' });
        }
        // Evitar duplicados
        const existente = await IPPermitida.findOne({ direccionIP });
        if (existente) {
            return res.status(400).json({ error: 'La IP ya está registrada.' });
        }
        const nuevaIP = new IPPermitida({ direccionIP, descripcion });
        await nuevaIP.save();
        res.status(201).json({ message: 'IP permitida agregada correctamente.', nuevaIP });
    } catch (error) {
        console.error('Error al agregar la IP permitida:', error);
        res.status(500).json({ error: 'Error al agregar la IP permitida.' });
    }
});

// Eliminar una IP permitida por su ID
app.delete('/api/ips/:ip', async (req, res) => {
    try {
        const { ip } = req.params;
        const ipEliminada = await IPPermitida.findOneAndDelete({ direccionIP: ip });
        if (!ipEliminada) {
            return res.status(404).json({ error: 'IP no encontrada.' });
        }
        res.status(200).json({ message: 'IP eliminada correctamente.', ipEliminada });
    } catch (error) {
        console.error('Error al eliminar la IP permitida:', error);
        res.status(500).json({ error: 'Error al eliminar la IP permitida.' });
    }
});

app.delete('/api/usuarios/:correo', async (req, res) => {
    const { correo } = req.params;
    try {
        const usuario = await Usuario.findOneAndDelete({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario.' });
    }
});
// Endpoint para verificar si un token existe en algún usuario (para restablecer contraseña)
app.get('/api/usuarios/token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const usuario = await Usuario.findOne({ token });
        if (!usuario) {
            return res.status(404).json({ error: 'Token no válido o expirado.', usuario: null });
        }
        // Verificar expiración del token
        if (!usuario.tokenExpira || usuario.tokenExpira < Date.now()) {
            // Eliminar token y expiración
            usuario.token = undefined;
            usuario.tokenExpira = undefined;
            await usuario.save();
            return res.status(404).json({ error: 'Token expirado.', usuario: null });
        }
        res.status(200).json({ usuario });
    } catch (error) {
        console.error('Error al buscar el token:', error);
        res.status(500).json({ error: 'Error al buscar el token.' });
    }
});

// Rutas amigables para páginas principales y de administración
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexAdmin.html'));
});
app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contacto.html'));
});
app.get('/sobre-nosotros', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sobre-nosotros.html'));
});
app.get('/admin/sobre-nosotros', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sobre-nosotrosAdmin.html'));
});
app.get('/terminos-condiciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terminos-condiciones.html'));
});
app.get('/admin/terminos-condiciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terminos-condicionesAdmin.html'));
});
app.get('/preguntas-respuestas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preguntas-respuestas.html'));
});
app.get('/admin/preguntas-respuestas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preguntas-respuestasAdmin.html'));
});
app.get('/producto/:id?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'producto.html'));
});
app.get('/admin/producto/:id?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'productoAdmin.html'));
});
app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'datos-perfil.html'));
});
app.get('/admin/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'datos-perfilAdmin.html'));
});
app.get('/restablecer-contrasena/:token?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'restablecer-contrasena.html'));
});
app.get('/factura/:factura?', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'confirmacion.html'));
});

app.get('/verificar-cuenta/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'restablecer-contrasena.html'));
});

// Endpoint para subir foto de perfil
app.post('/api/perfil/foto', uploadPerfiles.single('fotoPerfil'), async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ error: 'El correo es obligatorio' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
        }

        // Buscar el usuario actual para eliminar la foto anterior
        const usuarioActual = await Usuario.findOne({ correo });
        if (!usuarioActual) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Eliminar la foto anterior si existe
        if (usuarioActual.fotoPerfil) {
            const rutaAnterior = path.join(__dirname, 'public', usuarioActual.fotoPerfil);
            if (fs.existsSync(rutaAnterior)) {
                try {
                    fs.unlinkSync(rutaAnterior);
                    console.log(`Archivo de foto anterior eliminado: ${usuarioActual.fotoPerfil}`);
                } catch (error) {
                    console.error('Error al eliminar archivo anterior:', error);
                }
            }
        }

        const rutaFoto = `/img/perfiles/${req.file.filename}`;

        const usuario = await Usuario.findOneAndUpdate(
            { correo },
            { $set: { fotoPerfil: rutaFoto } },
            { new: true }
        );

        res.status(200).json({ 
            message: 'Foto de perfil actualizada exitosamente',
            fotoPerfil: rutaFoto
        });
    } catch (error) {
        console.error('Error al subir foto de perfil:', error);
        res.status(500).json({ error: 'Error al subir la foto de perfil.' });
    }
});

// ===== RUTAS PARA GESTIÓN DE IDIOMAS =====

// Obtener todos los idiomas activos




