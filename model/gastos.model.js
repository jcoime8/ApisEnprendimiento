import mongoose from "mongoose"

const gastoSchema = new mongoose.Schema({
    monto: {
        type: Number, 
        required: true, 
        min: 0 // Asegura que el monto sea un valor positivo
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 500 // Límite en caracteres para la descripción
    },
    categoria: {
        type: String,
        enum: ['Alimentos', 'Transporte', 'Salud', 'Vivienda', 'Educación', 'Entretenimiento', 'Otros'],
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now // Asigna la fecha actual si no se proporciona una fecha específica
    }
});

// Crear el modelo de Gasto
const Gasto = mongoose.model('Gasto', gastoSchema);

export {Gasto, gastoSchema}