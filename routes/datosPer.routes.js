import { Router } from "express";
import { getAllDatosP, getIdDatosP, postDatosP, putDatosP, deleteDatosP } from "../controller/datosP.controller.js";
import { getIdAllproyectos, postProyectos } from "../controller/proyectos.controller.js";
const datosRout = Router()

datosRout.get('/', getAllDatosP)
datosRout.get('/:id', getIdDatosP)
datosRout.get('/:id/proyectos', getIdAllproyectos)
datosRout.post('/', postDatosP)
datosRout.post('/:id/proyectos', postProyectos)
datosRout.put('/:id', putDatosP)
datosRout.delete('/:id', deleteDatosP)

export default datosRout