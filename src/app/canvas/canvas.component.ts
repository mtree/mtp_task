import { Component, ViewChild, ElementRef } from '@angular/core';
import { Box, BoxType } from '../../models/box.model';
import { Connection } from '../../models/connection.model'
import { jsPlumb } from 'jsplumb';
import { MagicBoxComponent } from '../magic-box/magic-box.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, MagicBoxComponent, FormsModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  jsPlumbInstance: any;

  boxes: Box[] = [];
  boxTypes = BoxType
  newBoxType: BoxType = BoxType.Red;
  connections: Connection[] = [];

  constructor() {
    this.jsPlumbInstance = jsPlumb.getInstance();
  }

  ngAfterViewInit() {
    this.jsPlumbInstance.ready(() => {
      this.jsPlumbInstance.setContainer(this.canvas.nativeElement);
      this.jsPlumbInstance.importDefaults({
        Connector: ["Straight"],
        Anchors: ["TopCenter"],
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: { stroke: '#666' },
        EndpointStyle: { width: 20, height: 16, stroke: '#666' },
        Endpoint: "Rectangle",
      });

      this.jsPlumbInstance.bind('connection', (info: any) => {
        this.connections.push({
          sourceId: info.sourceId,
          targetId: info.targetId,
        });
      });

      this.jsPlumbInstance.bind('beforeDrop', (info: any) => {
        return this.beforeDropHandler(info);
      });

      this.boxes.forEach(box => {
        this.jsPlumbInstance.draggable(box.id, { containment: false });
        this.addEndpoints(box.id);
      });
    });
  }

  boxTypeKeys(): string[] {
    return Object.keys(this.boxTypes);
  }

  addBox() {
    const newBox: Box = {
      id: `box${this.boxes.length + 1}`,
      type: this.newBoxType,
      name: `Box ${this.boxes.length + 1}`,
      fields: { name: `Box ${this.boxes.length + 1}` }
    };

    this.boxes.push(newBox);

    setTimeout(() => {
      this.jsPlumbInstance.draggable(newBox.id);
      this.addEndpoints(newBox.id);
    }, 0);
  }

  onBoxChange(updatedBox: Box) {
    const index = this.boxes.findIndex((box) => box.id === updatedBox.id);

    if (index !== -1) {
      this.boxes[index] = updatedBox;
    }
  }

  deleteBox(boxId: string) {
    this.boxes = this.boxes.filter((box) => box.id !== boxId);
    this.jsPlumbInstance.remove(boxId);
  }

  connectBoxes(connection: Connection) {
    this.jsPlumbInstance.connect({
      source: connection.sourceId,
      target: connection.targetId,
    });
  }

  private addEndpoints(elementId: string) {
    const exampleEndpointOptions = { isSource: true, isTarget: true, maxConnections: 2 };

    this.jsPlumbInstance.addEndpoint(elementId, { anchor: 'TopCenter' }, exampleEndpointOptions);
  }

  private beforeDropHandler(info: any): boolean {
    // TODO: We can provide better logic that would fulfill actual requirements
    const sourceBox = this.boxes.find(box => box.id === info.sourceId);
    const targetBox = this.boxes.find(box => box.id === info.targetId);

    if (sourceBox && targetBox) {
      if (sourceBox.type !== targetBox.type) {
        return true;
      }
    }

    return false;
  }
}
