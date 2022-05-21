import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Brush } from './brush';
import Pickr from '@simonwep/pickr';
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
  @ViewChild('save') aLinkDom!: ElementRef;
  constructor() { }


  ngOnInit() {
    this.initColorSelector();
    this.initListenerEvent();
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
   * 实例化颜色选择器
   *
   * @memberof TestComponent
   */
  initColorSelector() {
    const pickr = Pickr.create({
      el: '.color-picker',
      theme: 'nano', // 'classic', // or 'monolith', or 'nano'

      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
      ],

      components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: true,
          save: true
        }
      }
    });
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
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.centerX = this.canvas.width * 0.5;
      this.centerY = this.canvas.height * 0.5;
      this.context = this.canvas.getContext('2d');
    }
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
    this.addBackgroundColor()
  }

  /**
   * 给canvas加背景颜色
   *
   * @memberof TestComponent
   */
  addBackgroundColor() {
    const createCanvas = this.cloneCanvas(this.canvas);
    let newImgData = createCanvas.toDataURL("image/png");
    // 已经拿到数据了，这个时候就可以清空创建的canvas了
    this.downLoadPng(newImgData)

  }

  /**
   * 克隆旧的canvas
   *
   * @param {*} oldCanvas
   * @return {*} 
   * @memberof TestComponent
   */
  cloneCanvas(oldCanvas: HTMLCanvasElement) {

    //create a new canvas
    const newCanvas = document.createElement('canvas');
    const context = newCanvas.getContext('2d') as any;

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    context.fillStyle =  this.backTheme === 'light' ? "#f4e3cf" : "#212121";
    context.fillRect(0, 0, newCanvas.width, newCanvas.height);
    context.save();

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
  }


  /**
   *
   *
   * @param {*} base64Data
   * @memberof TestComponent
   */
  downLoadPng(base64Data: string) {
    const image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = () => {
      let saveDom = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件
      saveDom.download = new Date().toLocaleString() + "手绘素材"; // 设置图片名称
      saveDom.href = base64Data; // 将生成的URL设置为a.href属性
      saveDom.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = base64Data;
  }


}
