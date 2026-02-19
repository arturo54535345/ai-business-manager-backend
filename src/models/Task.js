const mongoose = require ('mongoose');

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "El titulo de la tarea es obligatorio"],
        trim: true,
    },
    description: {type: String},
    specefications: {type: String},
    
    status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "Medium"
    },
    category: {
        type: String,
        enum: ["Llamada", "Reunion", "Email","Tarea", "Reforma", "Mantenimiento", "Otro"],
        default: "Tarea"
    },
    //datos financieros
    budget: {type: Number, default: 0}, //lo que se cobrara por esta tarea
    cost: {type: Number, default: 0}, //lo que se ha gastado en esta tarea 

    dueDate: {type: Date}, //fecha limite para completar la tarea
    
    //relacion con el cliente
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: [true, "Debes asignar un cliente a la tarea"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Task', TaskSchema);