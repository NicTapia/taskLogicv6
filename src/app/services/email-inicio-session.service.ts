import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailInicioSessionService {
  constructor() {}

  sendLoginNotification(data: { name: string; email: string }): Promise<EmailJSResponseStatus> {
    const SERVICE_ID = 'service_p5mb5ao'; // Reemplaza con tu Service ID
    const TEMPLATE_ID = 'template_q9nvthp'; // Reemplaza con tu Template ID
    const PUBLIC_KEY = '7jq_BALUoVq8YHIc9'; // Reemplaza con tu Public Key

    console.log('Enviando notificación de inicio de sesión:', data);

    return emailjs
      .send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
      .then((response) => {
        console.log('Correo enviado exitosamente!', response.status, response.text);
        return response;
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        throw error;
      });
  }
}
