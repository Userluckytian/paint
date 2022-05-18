class Hair {
    x: number = 0;
    y: number = 0;
    inkAmount: number = 7;
    color: string = '#000';
    _latestPos: { [key: string]: number };

    constructor(x: number, y: number, inkAmount: number, color: string) {
        this.x = x || 0;
        this.y = y || 0;
        this.inkAmount = inkAmount;
        this.color = color;

        this._latestPos = { x: this.x, y: this.y };
    }

    render(ctx: any, offsetX: number, offsetY: number, offsetLength: number) {
        this._latestPos["x"] = this.x;
        this._latestPos["y"] = this.y;
        this.x += offsetX;
        this.y += offsetY;

        var per = offsetLength ? this.inkAmount / offsetLength : 0;
        if (per > 1) per = 1;
        else if (per < 0) per = 0;

        ctx.save();
        ctx.lineCap = ctx.lineJoin = 'round';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.inkAmount * per;
        ctx.beginPath();
        ctx.moveTo(this._latestPos["x"], this._latestPos["y"]);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.restore();
    }
}
export default Hair;
