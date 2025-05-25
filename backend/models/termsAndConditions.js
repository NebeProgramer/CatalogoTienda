const mongoose = require('mongoose');

const termsAndConditionsSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Asegurar que el campo id sea único y requerido
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    ultimaModificacion: { type: Date, default: Date.now },
    modificadoPor: { type: String, required: true }
});

module.exports = mongoose.model('TermsAndConditions', termsAndConditionsSchema);