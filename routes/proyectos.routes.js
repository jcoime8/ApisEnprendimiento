import { Router } from "express";
import {
    deleteProyectos,
    getAllproyectos,
    getIDProyectos,
    invitarAProyecto,
    putProyectos
} from "../controller/proyectos.controller.js";

import {
    getAllIngresos,
    getIdIngreso,
    postIngreso,
    putIngreso,
    deleteIngreso
} from "../controller/ingresos.controller.js";  // Importa los controladores de ingresos

import {
    getAllGastos,
    getIdGasto,
    postGasto,
    putGasto,
    deleteGasto
} from "../controller/gatos.controller.js";  // Importa los controladores de gastos

const proyecto = Router();

// Rutas para Proyectos
proyecto
    .get('/', getAllproyectos)
    .get('/:id', getIDProyectos)
    .put('/:id', putProyectos)
    .delete('/:id', deleteProyectos)
    .post('/invitar', invitarAProyecto)

// Rutas para Ingresos dentro de un Proyecto específico
proyecto
    .get('/:proyectoId/ingresos', getAllIngresos)          // Obtener todos los ingresos de un proyecto
    .get('/:proyectoId/ingresos/:ingresoId', getIdIngreso) // Obtener un ingreso específico por su ID
    .post('/:proyectoId/ingresos', postIngreso)             // Agregar un ingreso al proyecto
    .put('/:proyectoId/ingresos/:ingresoId', putIngreso)     // Actualizar un ingreso específico por su ID
    .delete('/:proyectoId/ingresos/:ingresoId', deleteIngreso) // Eliminar un ingreso específico por su ID

// Rutas para Gastos dentro de un Proyecto específico
proyecto
    .get('/:proyectoId/gastos', getAllGastos)              // Obtener todos los gastos de un proyecto
    .get('/:proyectoId/gastos/:gastoId', getIdGasto)        // Obtener un gasto específico por su ID
    .post('/:proyectoId/gastos', postGasto)                 // Agregar un gasto al proyecto
    .put('/:proyectoId/gastos/:gastoId', putGasto)          // Actualizar un gasto específico por su ID
    .delete('/:proyectoId/gastos/:gastoId', deleteGasto)    // Eliminar un gasto específico por su ID

export default proyecto;

