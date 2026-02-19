const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
    },
    email: {
        type: String,
        required:[true, "El email es obligatorio"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "El email no es válido"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        select: false
    },
    //preferecnias de usuario
    preferences: {
        aiTone: {
            type: String,
            enum: ["motivational", "analytical", "strategic"],
            default: "strategic"
        },
        monthlyGoal: {type: Number, default: 0}, //meta de dinero mensual inicalmente sera siempre 0, el usuario podra cambiarla 
        themeColor: {type: String, default: "blue"}//color de la interfaz de usuario por defecto
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {timestamps: true});

//middleware para encriptar las contraseñas antes de guardarla
UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();

    //genero un salt y encripto la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//metodo para comparar las contraseña que entra con la que ya esta
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//llave temporal para recuperar la contraseña nueva
UserSchema.methods.getResetPasswordToken = function() {
    //genero codigo aleatorio
    const resetToken = crypto.randomBytes(20).toString('hex');

    //lo encripto y lo guardo en la base de datos 
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //pongo fecha de caducidad de 10min
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    //devuelvo el codigo original para enviarlo por email
    return resetToken;

};

module.exports = mongoose.model('User', UserSchema);