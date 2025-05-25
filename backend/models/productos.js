const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: String,
    categoria: String,
    precio: Number,
    moneda: String,
    stock: Number,
    imagenes: [String],
    correo: String,
    destacado: Boolean,
    calificacion: Number,
    estado: { type: String, enum: ['disponible', 'no disponible'], default: 'disponible' },
    comentarios: [
        {
            usuario: String,
            correo: String, // Agregado para identificar al autor del comentario
            comentario: String,
            calificacion: Number
        }
    ]
});

module.exports = mongoose.model('Producto', productSchema);