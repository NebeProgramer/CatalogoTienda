const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true},
    nombre: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Categoria', categoriaSchema);