const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

// ==========================================
// 1. SEGURIDAD AVANZADA
// ==========================================
app.use(helmet()); // Protege las cabeceras HTTP

// Rate Limiting: Bloquea si hacen más de 100 peticiones en 10 min
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100, 
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 10 minutos.'
});
app.use('/api', limiter); // Aplicamos el límite solo a las rutas de la API

app.use(mongoSanitize()); // Evita inyección de código en MongoDB
app.use(xss()); // Evita scripts maliciosos en los inputs

// ==========================================
// 2. CONFIGURACIÓN GLOBAL
// ==========================================
app.use(morgan('dev')); // Muestra las peticiones en la consola
app.use(express.json({ limit: '10kb' })); // Limita el tamaño del JSON que recibes
app.use(cors()); // Permite que el Frontend se conecte

// ==========================================
// 3. RUTA DE ESTADO (Health Check)
// ==========================================
app.get('/', (req, res) => {
    res.status(200).json({
        message: '🚀 API AI Business Manager v2.0',
        status: 'Online',
        version: '2.0.0',
        timestamp: new Date()
    });
});

// ==========================================
// 4. RUTAS DE LA API (El corazón de la App)
// ==========================================
app.use('/api/auth', require('./routes/auth.routes'));

// 👇 AQUÍ IRÁN TUS PRÓXIMAS RUTAS (Descomenta cuando creemos los archivos) 👇
// app.use('/api/clients', require('./routes/client.routes'));
// app.use('/api/tasks', require('./routes/task.routes'));
// app.use('/api/finance', require('./routes/finance.routes'));
// app.use('/api/ai', require('./routes/ai.routes'));

// ==========================================
// 5. MANEJO DE RUTAS NO ENCONTRADAS (404)
// ==========================================
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `No encuentro la ruta ${req.originalUrl} en este servidor`
    });
});

module.exports = app;