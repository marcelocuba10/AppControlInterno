import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private loading: any;
  private dateFormat!: string;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      message,
      mode: 'ios',
      buttons: ['OK']
    });

    await alert.present();
  }

  getYears() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 20)).fill('').map((v, idx) => now - idx) as Array<number>;
  }

  getDate($event: any) {
    return this.dateFormat = moment($event.target.value).format('L');
  }

  async presentLoading(status: number) {
    //status if present 1 or dismiss 0
    if (status === 1) {
      this.loading = await this.loadingCtrl.create({
        message: 'Espere..',
        backdropDismiss: true,
        translucent: true,
        duration: 2000,
      });
      return this.loading.present();
    } else if (status === 0) {
      return this.loading.dismiss();
    }
  }

  async formValidation(model: any, page: string): Promise<boolean> {

    //model is a class;
    //page contain the data;
    console.log('ingreso en ');
    for (let i = 0; i < model.length; i++) {
      const element = model[i];
      console.log('length: ' + model.length);
      console.log('print: ' + element);
    }

    if (page === 'maintenance') {

      if (!model.km) {
        this.presentAlert('Insira o quilometragem atual');
        return false;
      }
      if (!model.km_prox) {
        this.presentAlert('Insira o próximo quilometragem para manutenção');
        return false;
      }
      if (!model.manutencao) {
        this.presentAlert('Selecione o tipo de manutenção realizada');
        return false;
      }
      if (!model.mecanica) {
        this.presentAlert('Selecione a mecanica responsavel pela manutenção realizada');
        return false;
      }
    }

    return true;

  }

}
