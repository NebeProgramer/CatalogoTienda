require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
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
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique ID generation
const RedSocial = require('./models/redSocial'); // Import the RedSocial model
const IPPermitida = require('./models/ipPermitida'); // Importa el modelo de IP permitida
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Conexión a MongoDB actualizada
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

// Verificar conexión a MongoDB

mongoose.connection.on('error', (err) => {
    console.error('Error en la conexión a MongoDB:', err);
});

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use('./public', express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(express.urlencoded({ extended: true })); // Middleware para procesar datos de formularios

// Configurar CORS
app.use(cors({
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

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
        cb(null, path.join(__dirname, '..', 'public', 'img'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const uploadProductos = multer({ storage: storageProductos });
const uploadSobreNosotros = multer({ storage: storageSobreNosotros });

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

// Endpoint para crear una cuenta de usuario
app.post('/api/crear-cuenta', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
        }

        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const newUser = new Usuario({
            correo,
            contrasena,
            nombre: "",
            apellido: "",
            telefono: "",
            direccion: [],
            descripcion: "",
            tarjeta: [],
            carrito: [],
            registroCompras: [] // Asegurarse de inicializar este campo
        });

        await newUser.save();
        res.status(201).json({ message: 'Cuenta creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la cuenta:', error);
        res.status(500).json({ error: 'Error al crear la cuenta.' });
    }
});

// Endpoint para iniciar sesión
app.post('/api/iniciar-sesion', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
        }
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }
        // Si es admin, verificar IP
        if (usuario.rol === 'admin') {
            // Obtener IP pública del request
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;
            // Limpiar IPv6 localhost
            const ipLimpia = ip.replace('::ffff:', '');
            const IPPermitida = require('./models/ipPermitida');
            const ipRegistrada = await IPPermitida.findOne({ direccionIP: ip });
            if (!ipRegistrada) {
                return res.status(403).json({ error: 'Acceso denegado: la IP no está registrada para administradores.' });
            }
        }
        res.status(200).json({ user: usuario });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión.' });
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


        const { correo, tarjeta, ...datosActualizados } = req.body;

        if (!correo) {
            return res.status(400).json({ error: 'El correo es obligatorio' });
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

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


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
        const { Id, Descripcion, Nombres, Apellidos, Correo, Telefono } = req.body;
        const foto = req.file ? `/img/${req.file.filename}` : req.body.foto || '/img/default.jpg'; // Usar el archivo subido o la ruta proporcionada

        console.log('Datos recibidos:', { Id, Descripcion, Nombres, Apellidos, Correo, Telefono, Foto: foto });

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
console.log('Datos de pago recibidos:', req.body); // Log para depuración
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
        }

        // Actualizar el registro de compras del usuario
        usuario.registroCompra = registroCompra;
        usuario.carrito = []; // Vaciar el carrito después de la compra
        await usuario.save();

        res.status(200).json({ message: 'Pago procesado con éxito.', factura: codigoFactura });
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).json({ error: 'Hubo un error al procesar el pago.' });
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

app.get('/', (req, res) => {
    res.send('API del catalogo de productos en funcionamiento');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
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
const historiaPath = path.join(__dirname, 'data', 'historia.json');

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
async function enviarCorreoRecuperacion(destinatario, token) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Correo desde variable de entorno
            pass: process.env.EMAIL_PASS  // Contraseña desde variable de entorno
        }
    });

    const enlace = `http://localhost:3000/restablecer-contrasena.html?token=${token}`;
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: 'Recuperación de contraseña',
        html: `<p>Hemos recibido una solicitud de recuperación de contraseña para la cuenta asociada al correo ${destinatario}.</p><p>Si no has solicitado este cambio, puedes ignorar este mensaje.</p><p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><a href="${enlace}">${enlace}</a>`
    };
    await transporter.sendMail(mailOptions);
}

// Endpoint para solicitar recuperación de contraseña
app.post('/api/recuperar-contrasena', async (req, res) => {
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
        // Aquí podrías guardar el token en la base de datos asociado al usuario
        usuario.token = token;
        await usuario.save();
        await enviarCorreoRecuperacion(usuario.correo, token);
        return res.status(200).json({ message: 'Si el correo existe, se enviarán instrucciones para recuperar la contraseña.' });
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud de recuperación.' });
    }
});

// Endpoint para restablecer la contraseña con token
app.post('/api/restablecer-contrasena', async (req, res) => {
    try {
        const { token, nuevaContrasena } = req.body;
        if (!token || !nuevaContrasena) {
            return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios.' });
        }
        // Buscar usuario con ese token
        const usuario = await Usuario.findOne({ token: token });
        if (!usuario) {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }
        usuario.contrasena = nuevaContrasena;
        usuario.token = undefined; // Eliminar el token para que no se reutilice
        await usuario.save();
        res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
});
