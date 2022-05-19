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
  loop!: () => void;
  mouseDown!: (e: {
    clientX: any; clientY: any;
  }) => void;
  mouseUp!: (e: any) => void;
  touchStart!: (e: any) => void;
  touchEnd!: (e: any) => void;
  touchMove!: (e: any) => void;
  mouseMove!: (e: any) => void;
  backTheme: 'dark' | 'light' = 'light';
  constructor() { }


  ngOnInit() {
    this.initListenerEvent()
  }
  /**
   * 实例化监听事件
   *
   * @memberof TestComponent
   */
  initListenerEvent() {
    this.brush = new Brush(this.centerX, this.centerY, this.randomColor());

    // 声明全局变量loop
    this.loop = () => {
      if (this.brush) {
        this.brush.render(this.context, this.mouseX, this.mouseY);
      }
      requestAnimationFrame(this.loop); // 回调自己
    };
    this.mouseMove = (e: any) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };

    this.mouseDown = (e: { clientX: any; clientY: any; }) => {
      this.brush.color = this.randomColor();
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (this.brush) {
        if (this.control && this.control.isRandomColor) {
          this.brush.color = this.randomColor();
        }
        if (this.control && this.control.isRandomSize) {
          this.brush.size = this.random(51, 5) | 0;
        }
        this.brush.startStroke(this.mouseX, this.mouseY);
      }
    };

    this.mouseUp = (e: any) => {
      if (this.brush) {
        this.brush.endStroke();
      }
    };

    this.touchMove = (e: any) => {
      var t = e.touches[0];
      this.mouseX = t.clientX;
      this.mouseY = t.clientY;
    };

    this.touchStart = (e: any) => {
      if (this.touched) return;
      this.touched = true;

      var t = e.touches[0];
      this.mouseX = t.clientX;
      this.mouseY = t.clientY;
      if (this.brush) {
        if (this.control && this.control.isRandomColor) {
          this.brush.color = this.randomColor();
        }
        if (this.control && this.control.isRandomSize) {
          this.brush.size = this.random(51, 5) | 0;
        }
        this.brush.startStroke(this.mouseX, this.mouseY);
      }
    };

    this.touchEnd = (e: any) => {
      this.touched = false;
      if (this.brush) {
        this.brush.endStroke();
      }
    };

  }

  ngAfterViewInit(): void {

    window.requestAnimationFrame = this.getAnimationFrame();

    this.canvas = document.getElementById('c');

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


  /**
   * 改变背景颜色
   *
   * @memberof TestComponent
   */
  changeBack() {
    if (this.backTheme === 'dark') {
      this.backTheme = 'light';
    } else if (this.backTheme === 'light') {
      this.backTheme = 'dark';
    }
  }
  /**
   * 清空绘制
   *
   * @memberof TestComponent
   */
  clearDraw() {
    this.resize(null);
  }

  /**
   * 保存为图片
   *
   * @memberof TestComponent
   */
  savePaint() {
  }





}
