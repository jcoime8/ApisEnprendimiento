import mongoose from "mongoose"

const ingresoSchema = new mongoose.Schema({
    monto: {
        type: Number,
        required: true,
        min: [0, 'El monto no puede ser negativo'],
    },
    categoria: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    personaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'datosPer', 
        required: true,
    },
});

const Ingreso = mongoose.model('Ingreso', ingresoSchema);

export { Ingreso, ingresoSchema};