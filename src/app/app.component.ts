import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

// Services
import { ToDoService } from './modules/to-do-list/services/to-do.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
})
export class AppComponent {
  constructor(private toDoService: ToDoService) { }

  // Offline First
  itemsList!: any[];
  item: any;

  onSaveItem() {
    if (!this.item?.id) {
      //Creating
      this.toDoService.save(this.item).then(() => {

      }).catch((err: any) => {
        console.log(err);
      });
    } else {
      // Updating
      this.toDoService.update(this.item).then(() => {

      }).catch((err: any) => {
        console.log(err);
      });
    }
  }
}
