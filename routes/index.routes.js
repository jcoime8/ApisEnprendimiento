import { Router } from "express";
import datosRout from "./datosPer.routes.js";
import proyecto from "./proyectos.routes.js";
const indexRouter = Router()

indexRouter.use('/datospersonales',datosRout)
indexRouter.use('/proyecto', proyecto)

export default indexRouter
