class Drop {
    x = 0;
    y = 0;
    size = 7;
    color = '#000';
    strokeId: string | null = null;
    life = 0;
    _latestPos: { [x: string]: number };
    _xOffRatio = 0;


    constructor(x: number, y: number, size: number, color: string, strokeId: string | null) {
        this.x = x || 0;
        this.y = y || 0;
        this.size = size;
        this.color = color;
        this.strokeId = strokeId;

        this.life = this.size * 1.5;
        this._latestPos = { x: this.x, y: this.y };
    }
    render(ctx: any) {
        if (Math.random() < 0.03) {
            this._xOffRatio += 0.06 * Math.random() - 0.03;
        } else if (Math.random() < 0.1) {
            this._xOffRatio *= 0.003;
        }

        this._latestPos["x"] = this.x;
        this._latestPos["y"] = this.y;
        this.x += this.life * this._xOffRatio;
        this.y += (this.life * 0.5) * Math.random();

        this.life -= (0.05 - 0.01) * Math.random() + 0.01;

        ctx.save();
        ctx.lineCap = ctx.lineJoin = 'round';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size + this.life * 0.3;
        ctx.beginPath();
        ctx.moveTo(this._latestPos["x"], this._latestPos["y"]);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
    }
}
export default Drop;
