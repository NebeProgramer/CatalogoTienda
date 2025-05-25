const mongoose = require('mongoose');

const RedSocialSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    enlace: { type: String, required: true }
});

module.exports = mongoose.model('RedSocial', RedSocialSchema);