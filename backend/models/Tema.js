const mongoose = require('mongoose');

const temaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    colores: {
        bgPrimary: { type: String, default: '#fff5e6' },
        bgSecondary: { type: String, default: '#e6a300' },
        bgTertiary: { type: String, default: '#ffffff' },
        textPrimary: { type: String, default: '#2c2c2c' },
        textSecondary: { type: String, default: '#555555' },
        textAccent: { type: String, default: '#d49000' },
        borderPrimary: { type: String, default: '#ddd' },
        borderSecondary: { type: String, default: '#ccc' },
        shadowLight: { type: String, default: 'rgba(0, 0, 0, 0.1)' },
        shadowMedium: { type: String, default: 'rgba(0, 0, 0, 0.2)' },
        success: { type: String, default: '#28a745' },
        warning: { type: String, default: '#ffc107' },
        error: { type: String, default: '#dc3545' },
        info: { type: String, default: '#17a2b8' },
        modalBg: { type: String, default: 'rgba(0, 0, 0, 0.4)' },
        hoverOverlay: { type: String, default: 'rgba(230, 163, 0, 0.15)' },
        selected: { type: String, default: '#e6a300' },
    },
    esPersonaje: { type: Boolean, default: false },
    emoji: { type: String, default: '🎨' },
    descripcion: { type: String, default: '' },
    fechaCreacion: { type: Date, default: Date.now },
    fechaModificacion: { type: Date, default: Date.now }
});

// Middleware para actualizar fechaModificacion
temaSchema.pre('save', function(next) {
    this.fechaModificacion = Date.now();
    next();
});

module.exports = mongoose.model('Tema', temaSchema);
