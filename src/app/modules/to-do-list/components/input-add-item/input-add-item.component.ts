import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  inject,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { NgClass } from '@angular/common';

// Interfaces
import { IListItems } from '../../interface/IListItems.interface';

@Component({
  selector: 'app-input-add-item',
  templateUrl: './input-add-item.component.html',
  styleUrls: ['./input-add-item.component.scss'],
  imports: [NgClass]
})
export class InputAddItemComponent {
  #cdr = inject(ChangeDetectorRef);

  @ViewChild("inputText") public inputText!: ElementRef;

  @Input({ required: true }) public inputListItems: IListItems[] = [];

  @Output() public outputAddListItems = new EventEmitter<IListItems>();
  public focusAndAddItem(value: string) {
    if (value) {
      this.#cdr.detectChanges();
      this.inputText.nativeElement.value = '';

      const currentDate = new Date();
      const timestamp = currentDate.getTime();
      const id = `ID${timestamp}`

      this.outputAddListItems.emit({
        id,
        checked: false,
        value
      });

      return this.inputText.nativeElement.focus();
    }
  }
}
