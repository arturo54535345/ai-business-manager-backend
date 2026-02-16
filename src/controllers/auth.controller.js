const User = require ('../models/User');
const jwt = require ('jsonwebtoken');
const sendEmail = require ('../utils/email');

const generateToken = (id) => {
    return jwt.sign ({id}, process.env.JWT_SECRET,{
        expiresIn: '30d'//solo durara 30 dias
    });
};

//@desc Registrar un usuario nuevo
//@route POST/api/auth/register
//@access Publico
exports.register = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        //veo si el usuario ya existe
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: 'Este correo ya esta registrado'});
        }
        //si no existe el usuario lo pueden crear  y se le asigna un token
        const user = await User.create({
            name,
            email,
            password
        });
        const token = generateToken(user._id);
        try{
            await sendEmail({
                email:user.email,
                subject: 'Bienvenido a AI Business Manager',
                message: `
                <h1>¡Hola ${user.name}!</h1>
                <p>Tu cuenta ha sido creada exitosamente.</p>
                <p>Ya puedes empezar a gestionar tus clientes y tu negocio con nuestra ayuda.</p>
                `
            });
        }catch(emailError){
            console.error('Error al enviar el correo...',emailError.message);
            //no dentengo el proceso de registro pero si se le notificara al usuario que lo hubo
        }

        res.status(201).json({
            toke,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences
            }
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error en el servidor...'});
    }
};

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        //busco el usuario por su correo 
        const user = await User.findOne({email}).select('+password');
        if(user && (await user.matchPassword(password))){
            res.json({
                token: generateToken(user._id),
                user:{
                    id: user._id,
                    name: user.name,
                    emial:user.email,
                    preferences: user.preferences
                }
            });
        }else{
            res.status(401).json({message: 'Credenciales invalidas...(Email o contraseña incorrectos)'});
        }
        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Error en el servidor al entrar'});
        }
}