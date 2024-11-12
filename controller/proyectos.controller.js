import datosPer from "../model/datosP.model.js";
import mongoose from "mongoose"
import { proyectos } from "../model/proyectos.model.js";


//mostrar todos los elementos
export const getAllproyectos = async(req, res) =>{
    try {
        const datos = await datosPer.find({},{__v:0})
        const proyecto = datos.flatMap(doc => doc.proyectos)
        if(proyecto.length === 0){
            return res.status(404).json({
                msg: 'No se an encontrado elementos'
            })
        }
        return res.status(200).json({
            proyecto
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los elementos' + error 
        })
    }
}

export const getIDProyectos = async(req, res) =>{
    const id = req.params.id
    
    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                msg: 'error id no valido'
            })
        }
        const datos = await datosPer.find({},{__v:0})
        const proyecto = datos.flatMap(doc => doc.proyectos).find(pro => pro._id.toString() === id)
        return res.status(200).json({
            proyecto
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los elementos' + error 
        })
    }
}

export const deleteProyectos = async (req, res) => {
    const id = req.params.id; 

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'ID no válido'
            });
        }

        const proyectoEli = await datosPer.findOneAndUpdate(
            { "proyectos._id": id }, 
            { $pull: { proyectos: { _id: id } } },  
            { new: true }  
        );
        if (!proyectoEli) {
            return res.status(404).json({
                msg: 'No se encontró el proyecto para eliminar'
            });
        }
        return res.status(200).json({
            msg: 'Proyecto eliminado correctamente',
            proyectoEli
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al eliminar el proyecto: ' + error
        });
    }
};

export const putProyectos = async (req, res) => {
    const id = req.params.id;  // ID del proyecto a actualizar
    const body = req.body;  // Nuevos datos a actualizar

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'ID no válido'
            });
        }

        // 1. Buscar el proyecto actual
        const datosPersonales = await datosPer.findOne({ "proyectos._id": id });
        
        if (!datosPersonales) {
            return res.status(404).json({
                msg: 'No se encontró el proyecto'
            });
        }

        // 2. Encuentra el proyecto específico dentro de la colección de proyectos
        const proyecto = datosPersonales.proyectos.id(id);

        // 3. Actualiza solo los campos enviados en el body
        Object.keys(body).forEach(key => {
            if (body[key] !== undefined) {
                proyecto[key] = body[key];
            }
        });

        // 4. Guardar los cambios
        await datosPersonales.save();

        return res.status(200).json({
            msg: 'Proyecto actualizado correctamente',
            proyecto
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al actualizar el proyecto: ' + error
        });
    }
};



//mostrara todos los proyectos de la persona
export const getIdAllproyectos = async (req, res) => {
    const id = req.params.id;
    try {
        // Buscamos el documento por el ID
        const datos = await datosPer.findById(id);
        
        if (!datos) {
            return res.status(404).json({
                msg: 'No se ha encontrado el elemento con el ID proporcionado'
            });
        }
        if (!Array.isArray(datos.proyectos)) {
            return res.status(404).json({
                msg: 'No se ha encontrado proyectos para este usuario'
            });
        }
        const proyectos = datos.proyectos;
        return res.status(201).json({
            proyectos
        });
    } catch (error) {
        console.error(error);  // Log para depuración
        return res.status(500).json({
            error: 'Error al mostrar los elementos: ' + error.message
        });
    }
}


export const postProyectos = async(req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        const ingresarProyecto = await datosPer.findByIdAndUpdate(id, {$push: {proyectos: body}}, {new:true, runValidators:true})
        if(!ingresarProyecto){
            return res.status(404).json({
                msg: 'no se a podido encontrar el elemento a registrar'
            })
        }
        return res.status(200).json({
            ingresarProyecto
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Error al mostrar los elementos' + error 
        })
    }
}



//invitar a una persona al proyecto
export const invitarAProyecto = async (req, res) => {
    const {personaId, proyectoId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(proyectoId)) {
            return res.status(400).json({
                msg: 'ID de proyecto no válido'
            });
        }

        const datos = await datosPer.find({}, { __v: 0 });
        const proyecto = datos.flatMap(doc => doc.proyectos).find(pro => pro._id.toString() === proyectoId);

        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            });
        }

        const persona = await datosPer.findById(personaId);
        if (!persona) {
            return res.status(404).json({
                msg: 'Persona no encontrada'
            });
        }

        const proyectoExistente = persona.proyectos.find(p => p._id.toString() === proyectoId);
        if (proyectoExistente) {
            return res.status(400).json({
                msg: 'Esta persona ya está asociada a este proyecto'
            });
        }

        persona.proyectos.push(proyecto); 
        await persona.save(); 

        return res.status(200).json({
            msg: 'Persona invitada al proyecto correctamente',
            persona
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error al invitar a la persona al proyecto: ' + error.message 
        });
    }
};

