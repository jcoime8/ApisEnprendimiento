import mongoose from "mongoose";
import datosPer from "../model/datosP.model.js";
import { json } from "express";

const getAllDatosP = async(req , res) =>{
    console.log('Mostrando todos los datos')
    try {
        const datos = await datosPer.find({},{__v:0})
        if(datos.length === 0){
            return res.status(404).json({
                msg: false
            })
        }
        return res.status(200).json({
            msg: true,
            datos
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los datos' + error
        })
    }
}

const getIdDatosP = async(req, res) =>{
    console.log('mostrara elemento por ide')
    const id = req.params.id
    try {
        const dato = await datosPer.findById(id)
        if(!dato){
            return res.status(404).json({
                msg: false
            })
        }
        return res.status(200).json({
            msg: true,
            dato
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los datos' + error
        })
    }
}

const postDatosP = async (req, res) => {
    console.log('Ingresando datos en la base de datos');
    const body = req.body;
    const dato = new datosPer(body);
    
    try {
        // Verifica si ya existe un dato con el mismo identificador (puedes cambiar `campoUnico` por el campo que desees verificar)
        const existingDato = await datosPer.findOne({ _id: dato._id });

        if (existingDato) {
            return res.status(400).json({
                msg: 'El dato ya existe en la base de datos.'
            });
        }

        // Validación del modelo
        const verificacion = dato.validateSync();
        if (verificacion) {
            const mesange = Object.values(verificacion.errors).map(err => err.message);
            return res.status(400).json({
                msg: mesange
            });
        }

        // Si no existe el dato, lo guardamos
        await dato.save();
        return res.status(200).json({
            msg: true,
            dato
        });
        
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los datos: ' + error
        });
    }
}


const putDatosP = async(req, res) => {
    console.log('actualizando Datos personales')
    const body = req.body
    const id = req.params.id
    try {
        const dato = await datosPer.findByIdAndUpdate(id, body, {new:true, runValidators: true})
        if(!dato){
            return res.status(404).json({
                msg: false
            })
        }
        return res.status(200).json({
            msg: true,
            dato
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los datos' + error
        })
    }
}

const deleteDatosP = async(req, res) =>{
    console.log('Eliminando datos personales');
    const id = req.params.id
    try {
        const dato = await datosPer.findByIdAndDelete(id)
        if(!dato){
            return res.status(404).json({
                msg: false
            })
        }
        return res.status(200).json({
            msg: true,
            dato
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los datos' + error
        })
    }
}

export {getAllDatosP, getIdDatosP, postDatosP, putDatosP, deleteDatosP}