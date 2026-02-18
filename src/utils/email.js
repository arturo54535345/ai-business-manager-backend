const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    //creo el transporter con la configuracion de Gmail
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //defino las opciones del email
  const mailOptions = {
    from: `"AI Business Manager" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: optios.subject,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">¡Bienvenido a bordo! 🚀</h1>
                </div>
                <div style="padding: 20px; background-color: #ffffff;">
                    <p style="font-size: 16px; color: #333;">Hola <strong>${options.name}</strong>,</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        Estamos encantados de tenerte en <strong>AI Business Manager</strong>. 
                        Tu cuenta ha sido creada con éxito.
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        Ahora tienes un Socio de IA listo para ayudarte a escalar tu negocio.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Entrar a mi Dashboard
                        </a>
                    </div>
                </div>
                <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                    © 2026 AI Business Manager. Todos los derechos reservados.
                </div>
        `,
  };
  //envio el email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
