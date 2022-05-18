# How To Use fabric-brash on your project

## 方案 A

1.  安装相关依赖

        npm install fabric --save-dev
        npm install fabric-brush --save-dev

2.  引入相关 js 包

        angular.json

        projectsname: {
           architect:{
               build:{
                   options:{
                       scripts:{
                           ...
                           "./node_modules/fabric/dist/fabric.min.js",
                           "./node_modules/fabric-brush/dist/fabric-brush.js"
                           ...
                       }
                   }
               }
           }
        }

3.  声明全局变量在`src/typings.d.ts`
    declear var fabric: any;

4. 在`app.component.ts`写如下代码：

    import {
        AfterViewInit, Component, ElementRef,
        NgZone, OnInit, ViewChild } from '@angular/core';

        @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
        })
        export class AppComponent implements OnInit, AfterViewInit {


            ngOnInit(): void {}

            ngAfterViewInit(): void {
                    this.initPaint();
            }

            /** 实例化画笔
            @memberof AppComponent
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

## 方案 B

该方案参考: [codePen](https://codepen.io/userluckytian/pen/zYRoVww?editors=0011)，我把es5的写法转为了es6的写法。

所有代码都在`app/components/test`文件夹下！

不需要安装任何依赖呦~ o(*￣▽￣*)ブ