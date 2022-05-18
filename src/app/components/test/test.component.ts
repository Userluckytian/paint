import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Brush } from './brush';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {

  // tip: 这是测试项，整个过程不需要安装README.md中的依赖！

  canvas: any;
  context: any;
  centerX: any;
  centerY: any;
  mouseX = 0;
  mouseY = 0;
  isMouseDown = false;
  brush: any; // brush实例对象！
  gui: any;
  control: any;
  guiColorCtr: any;
  guiSizeCtr: any;
  guiIsRandColorCtr: any;
  touched = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    window.requestAnimationFrame = this.getAnimationFrame();

    this.canvas = document.getElementById('c');

    this.brush = new Brush(this.centerX, this.centerY, this.randomColor());
    console.log('🚀 ~ this.brush', this.brush);

    window.addEventListener('resize', this.resize, false);
    // 默认执行一次清除操作
    this.resize(null);

    this.canvas.addEventListener('mousemove', this.mouseMove, false);
    this.canvas.addEventListener('mousedown', this.mouseDown, false);
    this.canvas.addEventListener('mouseout', this.mouseUp, false);
    this.canvas.addEventListener('mouseup', this.mouseUp, false);

    this.canvas.addEventListener('touchmove', this.touchMove, false);
    this.canvas.addEventListener('touchstart', this.touchStart, false);
    this.canvas.addEventListener('touchcancel', this.touchEnd, false);
    this.canvas.addEventListener('touchend', this.touchEnd, false);

    // Start Update
    this.loop();
  }



  /**
   * 获取 requestAnimationFrame 
   * 参考文献（下面代码是获取不同浏览器的AnimationFrame）
   * https://blog.csdn.net/yexudengzhidao/article/details/119640866
   *
   * @return {*} 
   * @memberof TestComponent
   */
  getAnimationFrame() {
    return window.requestAnimationFrame ||
      // window.webkitRequestAnimationFrame ||
      // window.mozRequestAnimationFrame ||
      // window.oRequestAnimationFrame ||
      // window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  }

  resize(e: any) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width * 0.5;
    this.centerY = this.canvas.height * 0.5;
    this.context = this.canvas.getContext('2d');
    if (this.control) {
      this.control.clear();
    }
  }

  mouseMove(e: { clientX: any; clientY: any; }) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  mouseDown(e: { clientX: any; clientY: any; }) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    if (this.control.isRandomColor) {
      this.brush.color = this.randomColor();
    }
    if (this.control.isRandomSize) {
      this.brush.size = this.random(51, 5) | 0;
    }
    this.brush.startStroke(this.mouseX, this.mouseY);
  }

  mouseUp(e: any) {
    this.brush.endStroke();
  }

  touchMove(e: { touches: any[]; }) {
    var t = e.touches[0];
    this.mouseX = t.clientX;
    this.mouseY = t.clientY;
  }

  touchStart(e: { touches: any[]; }) {
    if (this.touched) return;
    this.touched = true;

    var t = e.touches[0];
    this.mouseX = t.clientX;
    this.mouseY = t.clientY;
    if (this.control.isRandomColor) {
      this.brush.color = this.randomColor();
    }
    if (this.control.isRandomSize) {
      this.brush.size = this.random(51, 5) | 0;
    }
    this.brush.startStroke(this.mouseX, this.mouseY);
  }

  touchEnd(e: any) {
    this.touched = false;
    this.brush.endStroke();
  }

  randomColor() {
    let r = this.random(256) | 0;
    let g = this.random(256) | 0;
    let b = this.random(256) | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  random(max: number, min: number = 0) {
    if (typeof max !== 'number') {
      return Math.random();
    } else if (typeof min !== 'number') {
      min = 0;
    }
    return Math.random() * (max - min) + min;
  }

  loop() {
    console.log(this.brush);
    this.brush.render(this.context, this.mouseX, this.mouseY);
    requestAnimationFrame(this.loop); // 回调自己
  };
}
