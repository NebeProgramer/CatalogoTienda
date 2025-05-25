const mongoose = require('mongoose');

const CompanyInfoSchema = new mongoose.Schema({
    Id: { type: String, required: true },
    Descripcion: { type: String, required: true },
    Foto: { type: String, default: 'default.jpg' },
    Nombres: { type: String, required: true },
    Apellidos: { type: String, required: true },
    Correo: { type: String, required: true },
    Telefono: { type: String, required: true }
});

module.exports = mongoose.model('CompanyInfo', CompanyInfoSchema);