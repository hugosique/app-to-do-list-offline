import { Component, OnInit, signal } from '@angular/core';
import Swal from 'sweetalert2';

// Components
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';

// Interfaces
import { IListItems } from '../../interface/IListItems.interface';

// Services
import { ToDoService } from '../../services/to-do.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [InputAddItemComponent, InputListItemComponent]
})
export class ListComponent implements OnInit {
  public addItem = signal(true);
  #setListItems = signal<IListItems[]>([]);
  public getListItems = this.#setListItems.asReadonly();

  constructor(private toDoService: ToDoService) { }

  async ngOnInit() {
    await this.toDoService.initDB((doc, deleted) => {
      this.#setListItems.update((list: IListItems[]) => {
        const index = list.findIndex((i: IListItems) => i._id === doc._id);

        if (deleted) {
          return list.filter((i: IListItems) => i._id !== doc._id)
        }

        if (index !== -1) {
          const updated = [...list];
          updated[index] = doc;
          return updated;
        }

        return [...list, doc]
      })
    });

    await this.loadItems();
  }

  private async loadItems() {
    const items = await this.toDoService.getAllItems();
    this.#setListItems.set(items);
  }

  public async saveItem(value: IListItems) {
    await this.toDoService.save(value);
  }

  public listItemsStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((el: IListItems) => {
      return value === 'pending' ? !el.checked : el.checked
    });
  }

  public async updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    const item = this.getListItems().find((i) => i._id === newItem.id);

    if (item) await this.toDoService.update({ ...item, checked: newItem.checked }); 
  }

  public async updateItemText(newItem: { id: string, value: string }) {
    const item = this.getListItems().find((i) => i._id === newItem.id);

    if (item) await this.toDoService.update({ ...item, value: newItem.value });
  }

  public async deleteItem(id: string) {
    const result = await Swal.fire({
      title: "Deletar item?",
      text: "Você não poderá reverter isso!",
      // icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar item"
    });

    if (result.isConfirmed) {
      const currentItems = this.#setListItems();
      const itemToRemove = currentItems.find(el => el._id === id);

      if (itemToRemove) {
        await this.toDoService.remove(itemToRemove);
      }
    }
  }

  public deleteAllItems() {
    Swal.fire({
      title: "Deletar todos os items?",
      text: "Você não poderá reverter isso!",
      // icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      background: '#000',
      confirmButtonText: "Sim, deletar todos"
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const items = this.getListItems();
        for (const item of items) {
          await this.toDoService.remove(item);
        }
      }
    });
  }
}