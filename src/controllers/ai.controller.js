const aiService = require("../services/ai.services");

//chat con la ia
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ message: "Porfavor escriba una pregunta." });
    }
    //contexto del usuario para la IA
    const userContext = {
      name: req.user.name,
      preferences: req.user.preferences,
    };
    //pido respuesta a la IA
    const response = await aiService.generateBusinessAdvice(
      userContext,
      message,
    );
    res.json({ response });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al procesar tu consulta con la IA." });
  }
};
