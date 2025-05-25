const mongoose = require('mongoose');

const ipPermitidaSchema = new mongoose.Schema({
    direccionIP: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
            },
            message: props => `${props.value} no es una dirección IP válida.`
        }
    },
    descripcion: {
        type: String,
        required: false,
        maxlength: 100
    },
    creadaEn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('IPPermitida', ipPermitidaSchema);