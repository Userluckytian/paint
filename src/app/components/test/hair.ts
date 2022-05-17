class Hair {
    x = 0;
    y = 0;
    inkAmount = 7;
    color = '#000';
    _latestPos: { [x: string]: number };

    constructor(x: number, y: number, inkAmount: number, color: string) {
        this.x = x || 0;
        this.y = y || 0;
        this.inkAmount = inkAmount;
        this.color = color;

        this._latestPos = { x: this.x, y: this.y };
    }

    render(ctx: { save: () => void; lineCap: string; lineJoin: string; strokeStyle: string; lineWidth: number; beginPath: () => void; moveTo: (arg0: number, arg1: number) => void; lineTo: (arg0: number, arg1: number) => void; stroke: () => void; restore: () => void; }, offsetX: number, offsetY: number, offsetLength: number) {
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
