const mongoose = require('mongoose');

const canecaSchema = new mongoose.Schema({
    productoOriginal: {
        type: Object,
        required: true
    },
    productoEditado: {
        type: Object,
        required: false // Solo se incluye si es una edición
    },
    motivo: {
        type: String,
        required: true,
        maxlength: 500
    },
    fechaModificacion: {
        type: Date,
        default: Date.now,
        index: { expires: '30d' } // Configuración TTL para autoeliminado en 30 días
    }
});

module.exports = mongoose.model('Caneca', canecaSchema);