import mongoose from "mongoose";
import datosPer from "../model/datosP.model.js";  // Modelo de datos personales

// Obtener todos los ingresos de un proyecto específico
const getAllIngresos = async (req, res) => {
    console.log('Mostrando todos los ingresos de un proyecto');
    const proyectoId = req.params.proyectoId;

    try {
        // Buscar todos los documentos de datos personales y extraer el proyecto específico
        const datos = await datosPer.find({}, { __v: 0 });
        const proyecto = datos.flatMap(doc => doc.proyectos).find(pro => pro._id.toString() === proyectoId);

        if (!proyecto) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Proyecto no encontrado'
            });
        }

        return res.status(200).json({
            msg: true,
            ingresos: proyecto.ingresos  // Devuelve todos los ingresos del proyecto
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los ingresos: ' + error
        });
    }
};

// Obtener un ingreso específico por ID dentro de un proyecto
const getIdIngreso = async (req, res) => {
    console.log('Mostrando ingreso por ID en un proyecto');
    const { proyectoId, ingresoId } = req.params;

    try {
        // Buscar el proyecto específico dentro de datos personales
        const datos = await datosPer.find({}, { __v: 0 });
        const proyecto = datos.flatMap(doc => doc.proyectos).find(pro => pro._id.toString() === proyectoId);

        if (!proyecto) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Proyecto no encontrado'
            });
        }

        // Buscar el ingreso dentro del proyecto
        const ingreso = proyecto.ingresos.find(ing => ing._id.toString() === ingresoId);
        if (!ingreso) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Ingreso no encontrado'
            });
        }

        return res.status(200).json({
            msg: true,
            ingreso
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar el ingreso: ' + error
        });
    }
};

// Agregar un ingreso a un proyecto
const postIngreso = async (req, res) => {
    console.log('Ingresando un nuevo ingreso en el proyecto');
    const { proyectoId } = req.params;
    const body = req.body;

    try {
        // Usar una actualización directa para agregar el nuevo ingreso al proyecto específico
        const result = await datosPer.updateOne(
            { "proyectos._id": proyectoId },
            { $push: { "proyectos.$.ingresos": body } }
        );

        // Verificar si se encontró y actualizó el proyecto
        if (result.nModified === 0) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Proyecto no encontrado'
            });
        }

        return res.status(200).json({
            msg: 'Ingreso agregado correctamente',
            ingreso: body
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al ingresar el ingreso: ' + error
        });
    }
};


// Actualizar un ingreso en un proyecto
const putIngreso = async (req, res) => {
    console.log('Actualizando un ingreso en el proyecto');
    const { proyectoId, ingresoId } = req.params;  // IDs del proyecto y del ingreso a actualizar
    const body = req.body;  // Nuevos datos a actualizar

    try {
        // Verifica que los IDs sean válidos
        if (!mongoose.Types.ObjectId.isValid(proyectoId) || !mongoose.Types.ObjectId.isValid(ingresoId)) {
            return res.status(400).json({
                msg: 'ID(s) no válido(s)'
            });
        }

        // Usar una actualización directa para modificar solo los campos específicos
        const updateFields = {};

        // Solo actualiza los campos que se están enviando en body
        Object.keys(body).forEach(key => {
            if (body[key] !== undefined) {
                updateFields[`proyectos.$.ingresos.$[ingreso].${key}`] = body[key];
            }
        });

        // Realiza la actualización solo de los campos que están en el body
        const result = await datosPer.updateOne(
            { "proyectos._id": proyectoId, "proyectos.ingresos._id": ingresoId },  // Buscar el proyecto y el ingreso
            { $set: updateFields },  // Actualizar solo los campos enviados en el body
            { arrayFilters: [{ "ingreso._id": new mongoose.Types.ObjectId(ingresoId) }] }  // Filtro para el ingreso específico
        );

        // Verificar si se modificó el proyecto
        if (result.nModified === 0) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Ingreso no encontrado o no se actualizó'
            });
        }

        return res.status(200).json({
            msg: 'Ingreso actualizado correctamente',
            ingreso: body  // Devolver el ingreso actualizado
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al actualizar el ingreso: ' + error
        });
    }
};




// Eliminar un ingreso de un proyecto
const deleteIngreso = async (req, res) => {
    console.log('Eliminando un ingreso');
    const { proyectoId, ingresoId } = req.params;

    try {
        // Eliminar el ingreso del array de ingresos en el proyecto específico
        const updatedProyecto = await datosPer.findOneAndUpdate(
            { "proyectos._id": proyectoId },
            { $pull: { "proyectos.$.ingresos": { _id: ingresoId } } },
            { new: true }
        );

        if (!updatedProyecto) {
            return res.status(404).json({
                msg: false,
                mensaje: 'Ingreso o proyecto no encontrado'
            });
        }

        return res.status(200).json({
            msg: true,
            mensaje: 'Ingreso eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al eliminar el ingreso: ' + error
        });
    }
};

export { getAllIngresos, getIdIngreso, postIngreso, putIngreso, deleteIngreso };
