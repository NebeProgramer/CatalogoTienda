const mongoose = require('mongoose');

const DireccionSchema = new mongoose.Schema({
    Calle: String,
    Carrera: String,
    Casa: String,
    Piso: String,
    CodigoPostal: String,
    Departamento: String,
    Ciudad: String,
    Pais: String,
});

const TarjetaSchema = new mongoose.Schema({
    Titular: String,
    Numero: String,
    CVC: String,
    FechaVencimiento: String,
});

const carritoSchema = new mongoose.Schema({
    id: String,
    cantidad: Number,
});

const RegistroCompra = new mongoose.Schema({
    id: String,
    nombre: String,
    cantidad: Number,
    precio: Number,
    fecha: { type: Date, default: Date.now },
    factura: String,
    direccion: String,
    tarjeta: String,
    
});

const PerfilSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    nombre: { type: String, default: "" },
    apellido: { type: String, default: "" },
    telefono: { type: String, default: "" },
    direccion: [DireccionSchema],
    descripcion: { type: String, default: "" },
    tarjeta: [TarjetaSchema],
    carrito: [carritoSchema],
    registroCompra: [RegistroCompra],
    rol: { type: String, default: "usuario" },
    token: { type: String, default: "" },
});

module.exports = mongoose.model('Perfil', PerfilSchema);