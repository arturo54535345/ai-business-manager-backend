const express = require ('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

//Seguridad
app.use(helmet());//protejo las cabeceras http
app.use(mongoSanitize());//evito inyeccion de codigo en mongoDB
app.use(xss());//evito scripts maliciosos en los inputs
//Configuracion
app.use(morgan('dev'));//me muestra las peticiones en la consola
app.use(express.json({limit: '10kb'}));//limito el tamaño del json que recibo
app.use(cors());//permito que el frontend pueda hacer peticiones a mi backend

//simplemente hago esto para saber si mi servidor esta funcionando
app.get('/',(req, res) => {
    res.status(200).json({
        message: 'Server is running',
        version: '2.0.0',
        status: 'Online'
    });
});

//aqui mas adelante iran las rutas reales 

module.exports = app;
