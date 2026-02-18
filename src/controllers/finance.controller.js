const Finance = require("../models/Finance");

//los clientes obtienen todos sus movimientos
exports.getFinances = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let filter = { owner: req.user.id };

    // Filtro por tipo (ingreso/gasto)
    if (type) filter.type = type;

    // Filtro por fechas
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const finances = await Finance.find(filter).sort({ date: -1 });
    res.json(finances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener finanzas" });
  }
};

//crear movimiento financiero
exports.createFinance = async (req, res) => {
  try {
    const finance = await Finance.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).json(finance);
  } catch (error) {
    res.status(400).json({ message: "Error al crear movimiento" });
  }
};

//eliminar movimiento financiero
exports.deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    if (!finance) return res.status(404).json({ message: "No encontrado" });

    if (finance.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "No autorizado" });
    }

    await finance.deleteOne();
    res.json({ message: "Movimiento eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};

//obtener resumen financiero completo
exports.getSummary = async (req, res) => {
  try {
    const finances = await Finance.find({ owner: req.user.id });

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
    };

    finances.forEach((item) => {
      if (item.type === "ingreso") {
        summary.totalIncome += item.amount;
      } else {
        summary.totalExpenses += item.amount;
      }
    });

    summary.netProfit = summary.totalIncome - summary.totalExpenses;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Error al calcular resumen" });
  }
};
