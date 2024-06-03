import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { scheduleDayPageRoutingModule } from './scheduleDay-routing.module';

import { scheduleDayPage } from './scheduleDay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    scheduleDayPageRoutingModule
  ],
  providers: [
    Geolocation
  ],
  declarations: [scheduleDayPage]
})
export class scheduleDayPageModule {}
