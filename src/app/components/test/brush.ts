import Drop from "./drop";
import Hair from "./hair";
export class Brush {
    _SPLASHING_BRUSH_SPEED = 75;

    x = 0;
    y = 0;
    color = '#42445a';
    size = 20; // 画笔尺寸
    inkAmount = 5; // 下滴墨水的宽度
    splashing = true;
    dripping = true;
    _latestPos: { [key: string]: number } | null = null;
    _strokeId: string | null = null;
    _drops: any[] = [];
    _tip: any[] = [];
    requestAnimationFrame: any; // 就这吧，不知道咋说

    constructor(x: number = 0, y: number = 0, color?: string, size?: number, inkAmount?: number) {
        console.log(x, y, color);

        this.x = x;
        this.y = y
        if (color !== undefined) this.color = color;
        if (size !== undefined) this.size = size;
        if (inkAmount !== undefined) this.inkAmount = inkAmount;

        this._drops = [];
        this._resetTip();
        this.requestAnimationFrame = this.getAnimationFrame();
    }

    isStroke() {
        return Boolean(this._strokeId);
    }

    startStroke(mouseX?: number, mouseY?: number) {
        if (this.isStroke()) return;

        this._resetTip();

        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        this._strokeId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r, v;
            r = Math.random() * 16 | 0;
            v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    endStroke() {
        this._strokeId = this._latestPos = null;
    }

    render(ctx: any, x: number, y: number) {
        let dx, dy, i, len;
        let isStroke = this.isStroke();

        if (!this._latestPos) this._latestPos = {};
        this._latestPos["x"] = this.x;
        this._latestPos["y"] = this.y;
        this.x = x;
        this.y = y;

        if (this._drops.length) {
            var drops = this._drops;
            let drop: any;
            let sizeSq = this.size * this.size;

            for (i = 0, len = drops.length; i < len; i++) {
                drop = drops[i];

                dx = this.x - drop.x;
                dy = this.y - drop.y;

                if (
                    (isStroke && sizeSq > dx * dx + dy * dy && this._strokeId !== drop.strokeId) ||
                    drop.life <= 0
                ) {
                    drops.splice(i, 1);
                    len--;
                    i--;
                    continue;
                }

                drop.render(ctx);
            }
        }

        if (isStroke) {
            var tip = this._tip;
            let dist;
            let strokeId = this._strokeId;

            dx = this.x - this._latestPos["x"];
            dy = this.y - this._latestPos["y"];
            dist = Math.sqrt(dx * dx + dy * dy);

            if (this.splashing && dist > this._SPLASHING_BRUSH_SPEED) {
                let r, a, sr, sx, sy;
                let maxNum = (dist - this._SPLASHING_BRUSH_SPEED) * 0.5 | 0;
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                for (i = 0, len = maxNum * Math.random() | 0; i < len; i++) {
                    r = (dist - 1) * Math.random() + 1;
                    a = Math.PI * 2 * Math.random();
                    sr = 5 * Math.random();
                    sx = this.x + r * Math.sin(a);
                    sy = this.y + r * Math.cos(a);
                    ctx.moveTo(sx + sr, sy);
                    ctx.arc(sx, sy, sr, 0, Math.PI * 2, false);
                }
                ctx.fill();
                ctx.restore();

            } else if (this.dripping && dist < this.inkAmount * 2 && Math.random() < 0.05) {
                const dropInstance = new Drop(
                    this.x,
                    this.y,
                    (this.size + this.inkAmount) * 0.5 * ((0.25 - 0.1) * Math.random() + 0.1),
                    this.color,
                    this._strokeId
                )
                this._drops.push(dropInstance);
            }

            for (i = 0, len = tip.length; i < len; i++) {
                tip[i].render(ctx, dx, dy, dist);
            }
        }
    }

    _resetTip() {
        let tip: any[] = this._tip = [];
        let rad = this.size * 0.5;
        let x0, y0, a0, x1, y1, a1, cv, sv,
            i, len;

        a1 = Math.PI * 2 * Math.random();
        len = rad * rad * Math.PI / this.inkAmount | 0;
        if (len < 1) len = 1;

        for (i = 0; i < len; i++) {
            x0 = rad * Math.random();
            y0 = x0 * 0.5;
            a0 = Math.PI * 2 * Math.random();
            x1 = x0 * Math.sin(a0);
            y1 = y0 * Math.cos(a0);
            cv = Math.cos(a1);
            sv = Math.sin(a1);

            const hairInstance = new Hair(
                this.x + x1 * cv - y1 * sv,
                this.y + x1 * sv + y1 * cv,
                this.inkAmount,
                this.color
            )
            tip.push(hairInstance);
        }
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


    // #region 自动绘制需要的变量
    t = 0 // 贝塞尔函数涉及的占比比例，0<=t<=1
    isPrinting = false // 正在绘制中
    bezierNodes: Array<any> = [] // 绘制内部控制点的数组
    // #endregion

    /**
     * 自动绘制
     *
     * @param {*} ctx
     * @param {Array<any>} points 点集合: [{x:100,y:200}, {x:200,y:215}...]
     * @memberof Brush
     */
    autoDraw(ctx: any, points: Array<any>) {
        if (this.t >= 1) {
            this.isPrinting = false;
            this.bezierNodes = [];
            this.t = 0;
            return
        }
        this.isPrinting = true
        this.t += 0.01
        this.drawnode(ctx, points)
        this.requestAnimationFrame(this.autoDraw.bind(this, ctx, points))
    }


    drawnode(ctx: any, points: Array<any>) {
        if (!points.length) return
        const next_nodes = []
        points.forEach((item, index) => {
            if (points.length === 1) {
                this.bezierNodes.push(item)
                if (this.bezierNodes.length > 1) {
                    this.bezierNodes.forEach((obj, i) => {
                        if (i) {
                            let startX = this.bezierNodes[i - 1].x;
                            let startY = this.bezierNodes[i - 1].y;
                            let x = obj.x;
                            let y = obj.y;
                            ctx.beginPath()
                            ctx.moveTo(startX, startY)
                            ctx.lineTo(x, y)
                            ctx.strokeStyle = 'red'
                            ctx.stroke()
                        }
                    })
                }
            }
        })
        if (points.length) {
            for (var i = 0; i < points.length - 1; i++) {
                var arr = [{
                    x: points[i].x,
                    y: points[i].y
                }, {
                    x: points[i + 1].x,
                    y: points[i + 1].y
                }]
                next_nodes.push(this.bezier(arr, this.t))
            }
            this.drawnode(ctx, next_nodes)
        }

    }


    /**
     * 获取轨迹点
     *
     * @param {*} arr
     * @param {*} t
     * @return {*} 
     * @memberof Brush
     */
    bezier(arr: Array<any>, t: number) {
        let x = 0;
        let y = 0;
        let n = arr.length - 1;
        arr.forEach((item, index) => {
            if (!index) {
                x += item.x * Math.pow((1 - t), n - index) * Math.pow(t, index)
                y += item.y * Math.pow((1 - t), n - index) * Math.pow(t, index)
            } else {
                x += this.factorial(n) / this.factorial(index) / this.factorial(n - index) * item.x * Math.pow((1 - t), n - index) * Math.pow(t, index)
                y += this.factorial(n) / this.factorial(index) / this.factorial(n - index) * item.y * Math.pow((1 - t), n - index) * Math.pow(t, index)
            }
        })
        return {
            x: x,
            y: y
        }
    }

    /**
     *  从num *... 到1 的n阶方程
     *
     * @param {number} num
     * @return {*} 
     * @memberof Brush
     */
    factorial(num: number): number { //递归阶乘
        if (num <= 1) {
            return 1;
        } else {
            return num * this.factorial(num - 1);
        }
    }

}
