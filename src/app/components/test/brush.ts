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

    constructor(x: number = 0, y: number = 0, color?: string, size?: number, inkAmount?: number) {
        console.log(x, y, color);
        
        this.x = x;
        this.y = y
        if (color !== undefined) this.color = color;
        if (size !== undefined) this.size = size;
        if (inkAmount !== undefined) this.inkAmount = inkAmount;

        this._drops = [];
        this._resetTip();
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

}
