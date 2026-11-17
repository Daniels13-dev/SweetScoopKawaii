import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Solo inicializar si hay API key, sino usar modo "mock"
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, type, data } = body;

    if (!to || !subject || !type) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // HTML templates básicos dependiendo del tipo de correo
    let htmlContent = '';
    
    if (type === 'order_created') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdf2f8; padding: 30px; border-radius: 16px;">
          <h1 style="color: #be185d; text-align: center;">¡Hemos recibido tu pedido mágico! 🎀</h1>
          <p style="color: #831843; font-size: 16px;">Hola <strong>${data.name}</strong>,</p>
          <p style="color: #831843; font-size: 16px;">Queremos confirmarte que tu pedido <strong>#${data.orderNumber}</strong> ha sido recibido con éxito en Sweet Scoop Kawaii.</p>
          <div style="background-color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #475569;">Total a pagar: <strong>$${data.total.toLocaleString('es-CO')}</strong></p>
          </div>
          <p style="color: #831843; font-size: 16px;">Te avisaremos por aquí cuando tu cucharada sorpresa vaya en camino a <strong>${data.city}</strong>.</p>
          <p style="color: #be185d; text-align: center; font-size: 14px; margin-top: 30px;">¡Gracias por esparcir ternura con nosotros!</p>
        </div>
      `;
    } else if (type === 'order_updated') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdf2f8; padding: 30px; border-radius: 16px;">
          <h1 style="color: #9333ea; text-align: center;">¡Actualización de tu pedido! ✨</h1>
          <p style="color: #831843; font-size: 16px;">Hola,</p>
          <p style="color: #831843; font-size: 16px;">Tu pedido <strong>#${data.orderNumber}</strong> ha cambiado de estado.</p>
          <div style="background-color: white; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #475569; font-size: 14px;">Nuevo Estado:</p>
            <p style="margin: 5px 0 0 0; color: #9333ea; font-size: 24px; font-weight: bold; text-transform: uppercase;">${data.status}</p>
          </div>
          <p style="color: #831843; font-size: 16px;">Si tienes dudas sobre el envío, recuerda que puedes contactarnos por WhatsApp.</p>
          <p style="color: #be185d; text-align: center; font-size: 14px; margin-top: 30px;">Con amor,<br/>Sweet Scoop Kawaii</p>
        </div>
      `;
    }

    if (!resend) {
      console.log('--- SIMULACIÓN DE ENVÍO DE CORREO ---');
      console.log(`Para: ${to}`);
      console.log(`Asunto: ${subject}`);
      console.log(`Tipo: ${type}`);
      console.log('Añade RESEND_API_KEY en .env.local para enviar correos reales.');
      console.log('---------------------------------------');
      
      return NextResponse.json({ success: true, mocked: true });
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'Sweet Scoop Kawaii <pedidos@sweetscoopkawaii.com>', // Necesita dominio verificado en Resend
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: emailData });
    
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
