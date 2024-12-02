import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {}

  sendEmail(formData: { name: string; email: string }): Promise<EmailJSResponseStatus> {
    const SERVICE_ID = 'service_p5mb5ao'; // Reemplaza con tu Service ID
    const TEMPLATE_ID = 'template_69sfl1n'; // Reemplaza con tu Template ID
    const PUBLIC_KEY = '7jq_BALUoVq8YHIc9'; // Reemplaza con tu Public Key

    console.log('Enviando correo con los siguientes datos:', formData);

    return emailjs
      .send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        return response;
      })
      .catch((error) => {
        console.error('FAILED...', error);
        throw error;
      });
  }
}
