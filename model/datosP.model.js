import mongoose from "mongoose";
import { proyectosSchema } from "./proyectos.model.js";


const datosP = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },

    nombre:{
        type: String,
        required: true
    },

    apellido:{
        type: String,
        required: true
    },
    
    tipoPlan:{
        type:String,
        required: true
    },

    proyectos:[proyectosSchema]
})

const datosPer = mongoose.model('datosPersonales', datosP)

export default datosPer