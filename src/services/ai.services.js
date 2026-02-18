const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.generateBusinessAdvice = async (userContext, question) => {
  try {
    //contexto para la IA
    const systemPrompt = `Eres el "AI Business Manager", un socio estratégico experto en finanzas y productividad.
            
            DATOS DEL USUARIO:
            - Nombre: ${userContext.name}
            - Rol: Freelancer / Dueño de Agencia
            - Tono preferido: ${userContext.preferences.aiTone}
            
            TU OBJETIVO:
            Ayudar al usuario a tomar mejores decisiones, analizar sus finanzas y priorizar tareas.
            Sé directo, profesional y útil. Si faltan datos, pídelos amablemente.
            `;
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      model: "mixtral-8x7b-32768", //modelo de ia
      temperature: 0.7, //creatividad moderada
    });
    return (
      chatCompletion.choices[0]?.message?.content ||
      "Lo siento, no pude generar una respuesta"
    );
  } catch (error) {
    console.error("Error en groq AI:", error);
    throw new Error("Error al conectar con la IA de Groq");
  }
};
