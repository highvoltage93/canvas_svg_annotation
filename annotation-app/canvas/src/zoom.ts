import { CanvasImplementation } from "./canvas";

const ZOOM_INTENSITY = 0.09;
const ZOOM_MIN = 0.3;

export class Zoom extends CanvasImplementation {
    protected zoomIntensity: number = ZOOM_INTENSITY;
    protected minScale: number = ZOOM_MIN;
    protected maxScale: number = 10;
    protected isDrawing: boolean = false;
    protected isGrabbing: boolean = false;
    public activeType: "rectangle" | "zoom_move" | "opacity" = "opacity";

    constructor(canvas: HTMLCanvasElement, image: HTMLImageElement | string) {
        super(canvas, image);
        this.subscribeZoomListeners();
    }

    private subscribeZoomListeners(): void {
        document
            .getElementById("svg_container")
            ?.addEventListener("wheel", this.handleWheel.bind(this));
        document
            .getElementById("svg_container")
            ?.addEventListener("mousedown", this.handleMouseDown.bind(this));
        document
            .getElementById("svg_container")
            ?.addEventListener("mousemove", this.handleMouseMove.bind(this));
        document
            .getElementById("svg_container")
            ?.addEventListener("mouseup", this.handleMouseUp.bind(this));
        document
            .getElementById("svg_container")
            ?.addEventListener("mouseleave", this.handleMouseUp.bind(this));
    }
    public unsubscribeZoomListeners(): void {
        this.canvas.removeEventListener("wheel", this.handleWheel.bind(this));
        this.canvas.removeEventListener(
            "mousedown",
            this.handleMouseDown.bind(this)
        );
        this.canvas.removeEventListener(
            "mousemove",
            this.handleMouseMove.bind(this)
        );
        this.canvas.removeEventListener(
            "mouseup",
            this.handleMouseUp.bind(this)
        );
        this.canvas.removeEventListener(
            "mouseleave",
            this.handleMouseUp.bind(this)
        );
    }

    public handleWheel(e: WheelEvent): void {
        e.preventDefault();
        const mouseX = e.clientX - this.canvas.offsetLeft;
        const mouseY = e.clientY - this.canvas.offsetTop;
        const wheelDirection = e.deltaY < 0 ? 1 : -1;

        let newScale = this.scale + wheelDirection * this.zoomIntensity;
        newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
        if (newScale === this.scale) return;

        const scaleX = (mouseX - this.start.x) / (this.img.width * this.scale);
        const scaleY = (mouseY - this.start.y) / (this.img.height * this.scale);

        this.start.x -= this.img.width * (newScale - this.scale) * scaleX;
        this.start.y -= this.img.height * (newScale - this.scale) * scaleY;
        this.scale = newScale;

        this.drawImage();
    }

    private handleMouseDown(e: MouseEvent): void {
        // if (this.isDrawing) return;
        if (this.activeType !== "zoom_move") return;

        this.isGrabbing = true;
        this.draggedStart.x = e.clientX;
        this.draggedStart.y = e.clientY;
        this.canvas.style.cursor = "grabbing";
    }

    private handleMouseMove(e: MouseEvent): void {
        if (this.activeType !== "zoom_move") return;
        if (this.isDrawing || this.canvas.style.cursor !== "grabbing") return;

        if (this.isGrabbing || this.canvas.style.cursor === "grabbing") {
            const dx = e.clientX - this.draggedStart.x;
            const dy = e.clientY - this.draggedStart.y;
            this.start.x += dx;
            this.start.y += dy;
            this.draggedStart.x = e.clientX;
            this.draggedStart.y = e.clientY;
            this.drawImage();
        }
    }

    private handleMouseUp(): void {
        if (this.activeType !== "zoom_move") return;
        if (this.isDrawing) return;

        this.isGrabbing = false;
        this.canvas.style.cursor = "default";
    }
}
