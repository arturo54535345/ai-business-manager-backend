const dashboardService = require("../services/dashboard.service");

exports.getDashboardData = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);

    res.json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al generar el dashboard" });
  }
};
