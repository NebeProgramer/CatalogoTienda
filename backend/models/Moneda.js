const mongoose = require('mongoose');

const MonedaSchema = new mongoose.Schema({
    moneda: { type: String, required: true },
    nombre: { type: String, required: true },
    valor_en_usd: { type: Number, required: true }
});

module.exports = mongoose.model('Moneda', MonedaSchema);