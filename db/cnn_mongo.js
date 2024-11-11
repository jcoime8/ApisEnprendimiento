import mongoose from "mongoose";

let isconnection = false;

const conecionaMongo = async () =>{
    if(isconnection){
        console.log('connecton establecida correctamente'.green)
        return
    }

    try{
        await mongoose.connect(process.env.MONGO_URI)
        isconnection = true
        console.log('conexion establecida'.grey)
    }catch(respuesta){
        console.log(respuesta)
    }
}

let db = mongoose.connection;
db.on('error', (error) =>{
    isconnection = false
    console.log('error en la conexion ❌'.red, error)
})

db.on('open', () =>{
    isconnection = true
})

db.on('disconnected', () =>{
    isconnection = false
    console.log('Desconectando Mongo db ⚠'.yellow)
})

process.on('SIGINT', async ()=>{
    await mongoose.disconnect()
    console.log('mongo DB desconectado ⚠'.yellow)
    process.exit();
})

export {conecionaMongo, isconnection}