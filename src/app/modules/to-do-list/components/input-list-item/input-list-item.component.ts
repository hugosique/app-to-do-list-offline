import { Component, EventEmitter, Input, Output } from '@angular/core';

//Interfaces
import { IListItems } from '../../interface/IListItems.interface';

@Component({
  selector: 'app-input-list-item',
  templateUrl: './input-list-item.component.html',
  styleUrls: ['./input-list-item.component.scss'],
})
export class InputListItemComponent {
  @Input({ required: true }) public inputListItems: IListItems[] = [];

  @Output() public outputUpdateItemCheckbox = new EventEmitter<{
    id: string; checked: boolean;
  }>();
  public updateItemCheckbox(id: string, checked: boolean) {
    return this.outputUpdateItemCheckbox.emit({ id, checked });
  }

  @Output() public outputUpdateItemText = new EventEmitter<{
    id: string; value: string;
  }>();
  public updateItemText(id: string, value: string) {
    return this.outputUpdateItemText.emit({ id, value });
  }

  @Output() public outputDeleteItem = new EventEmitter<string>();
  public deleteItem(id: string) {
    return this.outputDeleteItem.emit(id);
  }
}
