import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Box } from '../../models/box.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-magic-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './magic-box.component.html',
  styleUrl: './magic-box.component.css'
})
export class MagicBoxComponent {
  @Input() box!: Box;
  @Output() boxChange = new EventEmitter<Box>();
  @Output() boxDelete = new EventEmitter<string>();
  @Output() boxConnect = new EventEmitter<{ sourceId: string; targetId: string }>();

  getFields(): string[] {
    return Object.keys(this.box.fields);
  }

  onFormSubmit() {
    this.boxChange.emit(this.box);
  }

  deleteBox() {
    this.boxDelete.emit(this.box.id);
  }
}
