import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EmailService } from 'src/app/services/email.service'; // Servicio de EmailJS

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  emailSvc = inject(EmailService); // Servicio EmailJS

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const userCredential = await this.firebaseSvc.singUp(this.form.value as User);
        const uid = userCredential.user.uid;
        this.form.controls.uid.setValue(uid);

        await this.firebaseSvc.updateUser(this.form.value.name);
        await this.setUserInfo(uid);

        // Enviar correo de confirmación
        const { name, email } = this.form.value;
        console.log('Enviando correo con:', { name, email });
        await this.emailSvc.sendEmail({ name, email });
        console.log('Correo enviado correctamente');

        // Mostrar mensaje de éxito
        this.utilsSvc.presentToast({
          message: 'Registro exitoso. Se envió un correo de confirmación.',
          duration: 3000,
          color: 'success',
        });
      } catch (error) {
        console.error('Error durante el registro o envío de correo:', error);

        // Mostrar mensaje de error
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 3000,
          color: 'danger',
        });
      } finally {
        loading.dismiss();
      }
    }
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const path = `users/${uid}`;
        const formData = { ...this.form.value };
        delete formData.password; // No guardar la contraseña

        await this.firebaseSvc.setDocument(path, formData);
        this.utilsSvc.saveInLocalStorage('user', formData);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();
      } catch (error) {
        console.error('Error al guardar datos del usuario:', error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 3000,
          color: 'danger',
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
