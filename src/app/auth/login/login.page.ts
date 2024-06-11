import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user!: User;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private appService: AppService
  ) { }

  ngOnInit() { }

  async login(form: NgForm) {
    try {
      this.appService.presentLoading(1);
      await this.authService.login(form.value.email, form.value.password).toPromise(); // Convertimos el observable en una promesa
      console.log("Logged In, Welcome!");
      this.appService.presentLoading(0);
      this.navCtrl.navigateRoot('tabs/home');
    } catch (error: any) { // Especificamos que error es de tipo any
      this.appService.presentLoading(0);
      console.error(error);
      if (error.status === 401) {
        this.appService.presentAlert("Usuario no encontrado. Verifique los datos.");
      } else {
        this.appService.presentAlert("Se produjo un error al iniciar sesión. Por favor, inténtelo de nuevo más tarde.");
      }
    }
  }
}
