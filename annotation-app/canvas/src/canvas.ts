export class CanvasImplementation {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D | null;
    public scale: number = 1;
    public img: HTMLImageElement;
    public start: { x: number; y: number };
    public draggedStart: { x: number; y: number };

    constructor(canvas: HTMLCanvasElement, image: any) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.img = new Image();
        this.img.width = this.canvas.width;
        this.img.height = this.canvas.height;
        this.img.onload = () => {
            const scaleX = this.canvas.width / this.img.width;
            const scaleY = this.canvas.height / this.img.height;
            this.scale = Math.min(scaleX, scaleY);
            this.drawImage();
        };
        this.img.src = image;
        this.start = { x: 0, y: 0 };
        this.draggedStart = { x: 0, y: 0 };
    }

    public drawImage() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const imgWidth = this.img.width * this.scale;
        const imgHeight = this.img.height * this.scale;
        this.ctx.drawImage(
            this.img,
            this.start.x,
            this.start.y,
            imgWidth,
            imgHeight
        );
    }
}