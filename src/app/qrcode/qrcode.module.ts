import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrcodePageRoutingModule } from './qrcode-routing.module';

import { QrcodePage } from './qrcode.page';
import { UpdateMachineModalComponent } from 'src/app/modal/update-machine-modal/update-machine-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrcodePageRoutingModule
  ],
  declarations: [QrcodePage,UpdateMachineModalComponent],
  entryComponents:[UpdateMachineModalComponent]
})
export class QrcodePageModule {}
