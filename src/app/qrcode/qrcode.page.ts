import { Component, OnInit } from '@angular/core';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import { UpdateMachineModalComponent } from 'src/app/modal/update-machine-modal/update-machine-modal.component';
import { Machine } from 'src/app/models/machine';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  scanActive: boolean = false;
  public QRresult: string;
  public machine: Machine;

  constructor(
    public alertController: AlertController,
    private menu: MenuController, //icon hamburguer menu
    private appService: AppService,
    private modalCtrl: ModalController,
    private apiService: ApiService
  ) {
    console.log("load constructor");
    this.menu.enable(true);
  }

  ngOnInit() {
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        this.QRresult = result.content;

        //if qrcode have 8 characters, is machine qrcode; else any character or link
        if (this.QRresult.length === 8) {
          this.getMachineByQRcode(this.QRresult);
        } else {
          this.appService.presentAlert(this.QRresult);
        }
      } else {
        this.appService.presentAlert('No data found!');
      }
    } else {
      this.appService.presentAlert('Not allowed!');
    }
  }

  async getMachineByQRcode(QRresult: string) {
    this.appService.presentLoading(1);
    this.apiService.getMachineByQRcode(QRresult).subscribe(response => {
      if (response == null || Object.keys(response).length === 0) {
        this.appService.presentLoading(0);
        this.appService.presentAlert('Codigo QR no registrado en el sistema');
      } else {
        this.appService.presentLoading(0);
        this.machine = response;
        this.openModal();
      }
    });
  }

  async openModal() {
    console.log(this.QRresult);
    const modal = await this.modalCtrl.create({
      component: UpdateMachineModalComponent,
      cssClass: 'my-custom-class',
      //pass data to model
      componentProps: {
        codeQR: this.QRresult,
        machine: this.machine,
      }
    });

    //go to modal
    await modal.present();
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

}
