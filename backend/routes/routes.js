const express = require('express');
const router = express.Router();
const Usuario = require('./models/perfil');
const Producto = require('./models/productos');
const Mensaje = require('./models/mensajes');
const TermsAndConditions = require('./models/termsAndConditions');
const Moneda = require('./models/Moneda');
const Ubicacion = require('./models/Ubicacion');
const Categoria = require('../models/categoria');
const Tema = require('../models/Tema');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'tu-correo@gmail.com',
        pass: process.env.EMAIL_PASS || 'tu-contraseña-app'
    }
});

// Función para enviar correo de verificación
async function enviarCorreoVerificacion(correo, token) {
    const urlVerificacion = `${process.env.BASE_URL || 'http://localhost:3000'}/verificar-correo?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER || 'andorpapi@gmail.com',
        to: correo,
        subject: 'Verificación de cuenta - Catálogo Tienda',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">¡Bienvenido a Catálogo Tienda!</h2>
                <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.</p>
                <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
                <a href="${urlVerificacion}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Verificar mi cuenta</a>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; color: #666;">${urlVerificacion}</p>
                <p><strong>Nota:</strong> Este enlace expirará en 24 horas por seguridad.</p>
                <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de verificación enviado a:', correo);
        return true;
    } catch (error) {
        console.error('Error al enviar correo de verificación:', error);
        return false;
    }
}

// Ruta para obtener productos
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

// Ruta para obtener monedas
router.get('/monedas', async (req, res) => {
    try {
        const monedas = await Moneda.find();
        res.status(200).json(monedas);
    } catch (error) {
        console.error('Error al obtener las monedas:', error);
        res.status(500).json({ error: 'Error al obtener las monedas.' });
    }
});

// Ruta para crear una cuenta
router.post('/crear-cuenta', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico.' });
        }
        
        // Generar token de verificación
        const tokenVerificacion = uuidv4();
        const tokenExpira = new Date();
        tokenExpira.setHours(tokenExpira.getHours() + 24); // Expira en 24 horas
        
        // Crear usuario con verificación pendiente
        const nuevoUsuario = new Usuario({ 
            correo, 
            contrasena,
            rol: 'no verificado',
            isVerified: false,
            token: tokenVerificacion,
            tokenExpira: tokenExpira
        });
        
        await nuevoUsuario.save();
        
        // Enviar correo de verificación
        const correoEnviado = await enviarCorreoVerificacion(correo, tokenVerificacion);
        
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

// Ruta para iniciar sesión
router.post('/iniciar-sesion', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await Usuario.findOne({ correo, contrasena });
        
        if (!usuario) {
            return res.status(404).json({ error: 'Credenciales incorrectas.' });
        }
        
        // Verificar si la cuenta está verificada
        if (!usuario.isVerified) {
            return res.status(403).json({ 
                error: 'Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico y haz clic en el enlace de verificación.',
                requiresVerification: true
            });
        }
        
        res.json({ 
            user: { 
                correo: usuario.correo, 
                nombre: usuario.nombre, 
                rol: usuario.rol 
            } 
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
});

// Ruta para verificar correo electrónico
router.get('/verificar-correo', async (req, res) => {
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

// Ruta para reenviar correo de verificación
router.post('/reenviar-verificacion', async (req, res) => {
    try {
        const { correo } = req.body;
        
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'No se encontró una cuenta con este correo electrónico.' });
        }
        
        if (usuario.isVerified) {
            return res.status(400).json({ error: 'Esta cuenta ya está verificada.' });
        }
        
        // Generar nuevo token de verificación
        const nuevoToken = uuidv4();
        const nuevaExpiracion = new Date();
        nuevaExpiracion.setHours(nuevaExpiracion.getHours() + 24);
        
        usuario.token = nuevoToken;
        usuario.tokenExpira = nuevaExpiracion;
        await usuario.save();
        
        // Enviar nuevo correo de verificación
        const correoEnviado = await enviarCorreoVerificacion(correo, nuevoToken);
        
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

// Ruta para registrar una compra
router.post('/usuarios/:correo/compras', async (req, res) => {
    try {
        const { correo } = req.params;
        const { compra } = req.body;
        const usuario = await Usuario.findOneAndUpdate(
            { correo },
            { $push: { registroCompras: compra } },
            { new: true }
        );
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(200).json({ message: 'Compra registrada exitosamente.', registroCompras: usuario.registroCompras });
    } catch (error) {
        console.error('Error al registrar la compra:', error);
        res.status(500).json({ error: 'Error al registrar la compra.' });
    }
});

// Ruta para guardar mensajes
router.post('/mensajes', async (req, res) => {
    try {
        const { Nombre, Correo, Mensaje: MensajeTexto } = req.body;
        const nuevoMensaje = new Mensaje({ Nombre, Correo, Mensaje: MensajeTexto });
        await nuevoMensaje.save();
        res.status(201).json({ message: 'Mensaje guardado exitosamente.' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ error: 'Error al guardar el mensaje.' });
    }
});

// Ruta para obtener ubicaciones
router.get('/ubicaciones', async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.find();
        res.status(200).json(ubicaciones);
    } catch (error) {
        console.error('Error al obtener las ubicaciones:', error);
        res.status(500).json({ error: 'Error al obtener las ubicaciones.' });
    }
});

// Ruta para obtener todas las categorías
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ error: 'Error al obtener las categorías.' });
    }
});

// Ruta para crear una nueva categoría
router.post('/categorias', async (req, res) => {
    try {
        const { nombre } = req.body;
        const nuevaCategoria = new Categoria({ nombre });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ error: 'Error al crear la categoría.' });
    }
});

// Ruta para actualizar una categoría
router.put('/categorias/:id', async (req, res) => {
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

// Ruta para eliminar una categoría
router.delete('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Categoria.findByIdAndDelete(id);
        res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error al eliminar la categoría.' });
    }
});

// ===== RUTAS PARA GESTIÓN DE TEMAS =====

// Obtener todos los temas
router.get('/temas', async (req, res) => {
    try {
        const temas = await Tema.find().sort({ fechaCreacion: -1 });
        res.json(temas);
    } catch (error) {
        console.error('Error al obtener temas:', error);
        res.status(500).json({ error: 'Error al obtener los temas' });
    }
});

// Obtener un tema específico
router.get('/temas/:id', async (req, res) => {
    try {
        const tema = await Tema.findById(req.params.id);
        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }
        res.json(tema);
    } catch (error) {
        console.error('Error al obtener tema:', error);
        res.status(500).json({ error: 'Error al obtener el tema' });
    }
});

// Crear un nuevo tema
router.post('/temas', async (req, res) => {
    try {
        const { nombre } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre del tema es requerido' });
        }

        // Verificar que el nombre no esté en uso
        const temaExistente = await Tema.findOne({ nombre: nombre.trim() });
        if (temaExistente) {
            return res.status(400).json({ error: 'Ya existe un tema con ese nombre' });
        }

        // Crear tema con colores por defecto del tema claro
        const nuevoTema = new Tema({
            nombre: nombre.trim(),
            colores: {
                bgPrimary: '#fff5e6',
                bgSecondary: '#e6a300',
                bgTertiary: '#ffffff',
                textPrimary: '#2c2c2c',
                textSecondary: '#555555',
                textAccent: '#d49000',
                borderPrimary: '#ddd',
                borderSecondary: '#ccc',
                shadowLight: 'rgba(0, 0, 0, 0.1)',
                shadowMedium: 'rgba(0, 0, 0, 0.2)',
                success: '#28a745',
                warning: '#ffc107',
                error: '#dc3545',
                info: '#17a2b8',
                modalBg: 'rgba(0, 0, 0, 0.4)',
                hoverOverlay: 'rgba(230, 163, 0, 0.15)'
            }
        });

        await nuevoTema.save();
        res.status(201).json(nuevoTema);
    } catch (error) {
        console.error('Error al crear tema:', error);
        res.status(500).json({ error: 'Error al crear el tema' });
    }
});

// Actualizar un tema
router.put('/temas/:id', async (req, res) => {
    try {
        const { colores, nombre } = req.body;
        const updateData = {};
        
        if (colores) updateData.colores = colores;
        if (nombre) {
            // Verificar que el nombre no esté en uso por otro tema
            const temaExistente = await Tema.findOne({ 
                nombre: nombre.trim(), 
                _id: { $ne: req.params.id } 
            });
            if (temaExistente) {
                return res.status(400).json({ error: 'Ya existe un tema con ese nombre' });
            }
            updateData.nombre = nombre.trim();
        }

        const tema = await Tema.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        res.json(tema);
    } catch (error) {
        console.error('Error al actualizar tema:', error);
        res.status(500).json({ error: 'Error al actualizar el tema' });
    }
});

// Aplicar un tema (marcar como activo)
router.post('/temas/:id/aplicar', async (req, res) => {
    try {
        // Desactivar todos los temas
        await Tema.updateMany({}, { activo: false });
        
        // Activar el tema seleccionado
        const tema = await Tema.findByIdAndUpdate(
            req.params.id,
            { activo: true },
            { new: true }
        );

        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        // Devolver el tema completo con sus colores para aplicar inmediatamente
        res.json({ 
            message: 'Tema aplicado exitosamente', 
            tema: {
                _id: tema._id,
                nombre: tema.nombre,
                colores: tema.colores,
                activo: tema.activo
            }
        });
    } catch (error) {
        console.error('Error al aplicar tema:', error);
        res.status(500).json({ error: 'Error al aplicar el tema' });
    }
});

// Eliminar un tema
router.delete('/temas/:id', async (req, res) => {
    try {
        const tema = await Tema.findById(req.params.id);
        
        if (!tema) {
            return res.status(404).json({ error: 'Tema no encontrado' });
        }

        // No permitir eliminar el tema activo
        if (tema.activo) {
            return res.status(400).json({ error: 'No se puede eliminar el tema activo' });
        }

        await Tema.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tema eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tema:', error);
        res.status(500).json({ error: 'Error al eliminar el tema' });
    }
});

// Obtener el tema activo
router.get('/tema-activo', async (req, res) => {
    try {
        const temaActivo = await Tema.findOne({ activo: true });
        if (!temaActivo) {
            return res.status(404).json({ error: 'No hay tema activo' });
        }
        res.json(temaActivo);
    } catch (error) {
        console.error('Error al obtener tema activo:', error);
        res.status(500).json({ error: 'Error al obtener el tema activo' });
    }
});

module.exports = router;