import mongoose from "mongoose";
import { ingresoSchema } from "./ingresos.model.js";
import { gastoSchema } from "./gastos.model.js";


const proyectosSchema = new mongoose.Schema({
    nombre: { 
        type: String, required: true 
    },
    moneda: { type: String, default: 'USD' },
    fechaCreacion: { type: Date, default: Date.now },
    objetivo: { type: String, required: false },
    ingresos: [ingresoSchema],
    gstos: [gastoSchema]
})

const proyectos = mongoose.model('proyectos', proyectosSchema)

export {proyectos, proyectosSchema}