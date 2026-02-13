require('dotenv').config();//cargo variables de entorno
const app= require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

//conecto a la base de datos
connectDB();
//encender el servidor 
const server = app.listen(PORT,() => {
    console.log(`\n Servidor corriendo en el puerto ${PORT} \n`);
    console.log(`http://localhost:${PORT}`);
});
//manejo de errores no controlados
process.on('unhandledRejection',(err)=>{
    console.log(`Error no controlado: Apagando el servidor...`);
    console.log(err.name, err.message);
    server.close(()=> process.exit(1));
});