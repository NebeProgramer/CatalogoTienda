const mongoose = require('mongoose');

const CiudadSchema = new mongoose.Schema({
    nombre: { type: String, required: true }
});

const DepartamentoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    ciudades: { type: [CiudadSchema], required: true }
});

const PaisSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    departamentos: { type: [DepartamentoSchema], required: true }
});

module.exports = mongoose.model('Ubicacion', PaisSchema);