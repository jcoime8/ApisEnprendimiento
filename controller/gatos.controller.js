import mongoose from "mongoose";
import { Gasto } from "../model/gastos.model.js"; 
import datosPer from "../model/datosP.model.js";

// Obtener todos los gastos
const getAllGastos = async (req, res) => {
    console.log('Mostrando todos los gastos');
    
    try {
        // Obtener todos los gastos de la base de datos
        const gastos = await Gasto.find({});

        return res.status(200).json({
            msg: true,
            gastos // Devuelve todos los gastos
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los gastos: ' + error
        });
    }
};

// Obtener un gasto específico por ID
const getIdGasto = async (req, res) => {
    console.log('Mostrando gasto por ID');
    const { gastoId } = req.params;

    try {
        // Buscar el gasto por ID
        const gasto = await Gasto.findById(gastoId);

        if (!gasto) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Gasto no encontrado'
            });
        }

        return res.status(200).json({
            msg: true,
            gasto
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar el gasto: ' + error
        });
    }
};

// Agregar un nuevo gasto
const postGasto = async (req, res) => {
    console.log('Ingresando un nuevo gasto en el proyecto');
    const { proyectoId } = req.params;
    const body = req.body;

    try {
        // Usar una actualización directa para agregar el nuevo gasto al proyecto específico
        const result = await datosPer.updateOne(
            { "proyectos._id": proyectoId },
            { $push: { "proyectos.$.gstos": body } }  // Agregar el nuevo gasto al proyecto
        );

        // Verificar si se encontró y actualizó el proyecto
        if (result.nModified === 0) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Proyecto no encontrado'
            });
        }

        return res.status(200).json({
            msg: 'Gasto agregado correctamente',
            gasto: body  // Devolver el gasto agregado
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al ingresar el gasto: ' + error
        });
    }
};

// Actualizar un gasto
const putGasto = async (req, res) => {
    console.log('Actualizando un gasto');
    const { gastoId } = req.params;
    const body = req.body;

    try {
        // Verifica que el ID del gasto sea válido
        if (!mongoose.Types.ObjectId.isValid(gastoId)) {
            return res.status(400).json({
                msg: 'ID de gasto no válido'
            });
        }

        // Actualizar solo los campos enviados en el body
        const updateFields = {};

        // Solo actualiza los campos que se están enviando en body
        Object.keys(body).forEach(key => {
            if (body[key] !== undefined) {
                updateFields[key] = body[key];
            }
        });

        // Realizar la actualización solo de los campos que están en el body
        const result = await Gasto.findByIdAndUpdate(
            gastoId,
            { $set: updateFields },
            { new: true } // Devuelve el gasto actualizado
        );

        if (!result) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Gasto no encontrado o no se actualizó'
            });
        }

        return res.status(200).json({
            msg: 'Gasto actualizado correctamente',
            gasto: result // Devolver el gasto actualizado
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al actualizar el gasto: ' + error
        });
    }
};

// Eliminar un gasto
const deleteGasto = async (req, res) => {
    console.log('Eliminando un gasto');
    const { gastoId } = req.params;

    try {
        // Eliminar el gasto por ID
        const result = await Gasto.findByIdAndDelete(gastoId);

        if (!result) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Gasto no encontrado'
            });
        }

        return res.status(200).json({
            msg: true,
            mensaje: 'Gasto eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al eliminar el gasto: ' + error
        });
    }
};

export { getAllGastos, getIdGasto, postGasto, putGasto, deleteGasto };
