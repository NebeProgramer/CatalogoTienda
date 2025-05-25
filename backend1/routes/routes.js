const express = require('express');
const router = express.Router();
const Usuario = require('./models/perfil');
const Producto = require('./models/productos');
const Mensaje = require('./models/mensajes');
const TermsAndConditions = require('./models/termsAndConditions');
const Moneda = require('./models/Moneda');
const Ubicacion = require('./models/Ubicacion');
const Categoria = require('../models/categoria');

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
        const nuevoUsuario = new Usuario({ correo, contrasena });
        await nuevoUsuario.save();
        res.status(201).json({ message: 'Cuenta creada exitosamente' });
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
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json({ user: { correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol } });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión.' });
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

module.exports = router;