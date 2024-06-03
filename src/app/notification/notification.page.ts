import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { TabsPage } from 'src/app/tabs/tabs.page';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  report$!: Observable<Notification>;
  user!: User;
  notifications: any;
  notification$!: Observable<Notification[]>;

  constructor(
    private menu: MenuController, //icon hamburguer menu
    public apiService: ApiService,
    private appService: AppService,
    private tab: TabsPage, //variable global user from page main;
  ) {
    console.log("load constructor");
    this.menu.enable(true);
  }

  ngOnInit() {
    console.log("load ngOnInit");
  }

  async ionViewWillEnter() {
    console.log("load ionViewWillEnter");
    this.getNotifications();
  }

  getNotifications() {
    console.log("load getNotifications");
    try {
      this.apiService.getNotifications().subscribe(response => {
        if (response == null || response.length == 0) {
          this.notifications = 'Sin Avisos';
        } else {
          this.notifications = response;
          console.log(this.notifications);
        }
      });
    } catch (error) {
      this.appService.presentAlert('Falla en la obtencion de notificaciones');
    }

  }

}
