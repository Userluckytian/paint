import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'my-app';
  constructor(
  ) {

  }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.initPaint();
  }


  /**
   * 实例化画笔
   *
   * @memberof AppComponent
   */
  initPaint() {
    const canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true
    });

    // Ink Brush
    canvas.freeDrawingBrush = new fabric.InkBrush(canvas, {
      width: 16,
      opacity: 0.6,
      color: "#ff0082"
    });
  }
}
