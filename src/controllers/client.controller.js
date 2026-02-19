const Client = require('../models/Client');

//el logueado obtiene a sus clientes, no los de otros usuarios
exports.getClients = async (req, res) => {
    try {
        // Buscamos solo los clientes cuyo 'owner' sea el usuario logueado
        const clients = await Client.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

//obtengo al cliente por su id
exports.getClientById = async(req, res) => {
    try{
        const client = await Client.findById(req.params.id);
        if(!client){
            return res.status(404).json({message: 'Cliente no encontrado'});
        }
        //verifico que el cliente pertenezca al usuario logueado
        if(client.owner.toString() !== req.user.id) {
            return res.status(401).json({message: 'No estas autorizado...'});
        }

        res.json(client);
    }catch(error){
        res.status(500).json({message: 'Error al obtener el cliente...'});
    }
};

//funcion para crear un cliente nuevo
exports.createClient = async (req, res) => {
    try {
        // Añadimos el ID del usuario dueño a los datos que vienen del frontend
        const clientData = {
            ...req.body,
            owner: req.user.id
        };

        const client = await Client.create(clientData);
        res.status(201).json(client);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al crear cliente' });
    }
};

//funcion para actulizar al cliente 
exports.updateClient = async (req, res) => {
    try {
        let client = await Client.findById(req.params.id);

        if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

        if (client.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        client = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el objeto ya actualizado
            runValidators: true
        });

        res.json(client);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar' });
    }
};

//funcion para eliminar al cliente 
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

        if (client.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        await client.deleteOne();
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};