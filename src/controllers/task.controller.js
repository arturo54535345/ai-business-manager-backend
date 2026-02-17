const Task = require("../models/Task");

//obtener tareas del usuario
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, clientId } = req.query;

    //construyo un filtro
    const filter = { owner: req.user.id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (clientId) filter.client = clientId;

    //busco las tareas del usuario con el filtro
    const tasks = await Task.find(filter)
      .populate("client", "name companyName")
      .sort({ dueDate: 1 }); //ordeno por fecha de vencimiento

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las tareas..." });
  }
};

//funcion para crear una tarea
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error al crear la tarea..." });
  }
};

//funcion para actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar" });
  }
};

//eliminar la tarea
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "No estas autorizado..." });
    }
    await task.deleteOne();
    res.json({ message: "Tarea eliminada correctamente " });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la tarea..." });
  }
};

//obtener una tarea por su id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "client",
      "name email",
    );

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    if (task.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tarea" });
  }
};
