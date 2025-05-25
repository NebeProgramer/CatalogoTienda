const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    Correo: { type: String, required: true },
    Mensaje: { type: String, required: true },
    Respuesta: { type: String, required: false },
    Fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mensaje', mensajeSchema);