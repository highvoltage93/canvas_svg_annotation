import { Zoom } from "./zoom";

export class CanvasWithSVG extends Zoom {
    private svg: SVGSVGElement;
    private currentRect?: SVGRectElement;
    private startSVGPoint: { x: number; y: number };
    private rects: Array<{
        element: SVGRectElement;
        startX: number;
        startY: number;
        endX: number;
        endY: number;
    }> = [];
    private is_initialized: boolean = false;

    constructor(canvas: HTMLCanvasElement, image: HTMLImageElement | string, svgId: string) {
        super(canvas, image);
        this.svg = document.getElementById("svg_container") as unknown as SVGSVGElement;
        this.startSVGPoint = { x: 0, y: 0 };
        this.initializeSVGEvents();
    }

    private initializeSVGEvents(): void {
        if (this.is_initialized) return;

        this.svg.addEventListener("mousedown", this.handleSVGMouseDown.bind(this));
        this.svg.addEventListener("mousemove", this.handleSVGMouseMove.bind(this));
        window.addEventListener("mouseup", this.handleSVGMouseUp.bind(this)); // Обрабатываем на уровне window для гарантии отпускания
        this.is_initialized = true;
    }

    private handleSVGMouseDown(e: MouseEvent): void {
        if (this.activeType !== "rectangle") return;

        this.isDrawing = true;
        this.isGrabbing = false;
        const svgRect = this.svg.getBoundingClientRect();
        this.startSVGPoint.x = e.clientX - svgRect.left;
        this.startSVGPoint.y = e.clientY - svgRect.top;
        this.currentRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        this.setRectParams();
        this.svg.appendChild(this.currentRect);
    }

    private handleSVGMouseMove(e: MouseEvent): void {
        this.updateRects();
        if (!this.isDrawing || !this.currentRect) return;
        this.isDrawing = true;
        this.isGrabbing = false;

        const svgRect = this.svg.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        const width = mouseX - this.startSVGPoint.x;
        const height = mouseY - this.startSVGPoint.y;

        this.currentRect.setAttribute("width", Math.abs(width).toString());
        this.currentRect.setAttribute("height", Math.abs(height).toString());
        this.currentRect.setAttribute("x", (width > 0 ? this.startSVGPoint.x : mouseX).toString());
        this.currentRect.setAttribute("y", (height > 0 ? this.startSVGPoint.y : mouseY).toString());
    }

    private handleSVGMouseUp(): void {
        if (!this.isDrawing || !this.currentRect) return;
        // Пересчитываем координаты в исходный масштаб изображения
        const height = parseInt(this.currentRect.getAttribute("height")!);
        const width = parseInt(this.currentRect.getAttribute("width")!);
        const startX = (parseInt(this.currentRect.getAttribute("x")!) - this.start.x) / this.scale;
        const startY = (parseInt(this.currentRect.getAttribute("y")!) - this.start.y) / this.scale;
        const endX = startX + width / this.scale;
        const endY = startY + height / this.scale;

        this.currentRect.setAttribute("id", `rectangle_${this.rects.length + 1}`);
        this.currentRect.setAttribute("class", "annotation_element");

        this.rects.push({
            element: this.currentRect,
            startX,
            startY,
            endX,
            endY,
        });

        // this.currentRect.addEventListener("mouseenter", (e) => this.onRectHover(e, this.currentRect));
        // this.currentRect.addEventListener("mouseleave", (e) => this.onRectLeave(this.currentRect));

        this.attachHoverListeners();

        this.isDrawing = false;
        this.currentRect = undefined;
    }

    private updateRects(): void {
        this.rects.forEach((rectData) => {
            const { element, startX, startY, endX, endY } = rectData;
            // Пересчитываем координаты и размеры в текущем масштабе
            const currentX = this.start.x + startX * this.scale;
            const currentY = this.start.y + startY * this.scale;
            const currentWidth = (endX - startX) * this.scale;
            const currentHeight = (endY - startY) * this.scale;

            element.setAttribute("x", currentX.toString());
            element.setAttribute("y", currentY.toString());
            element.setAttribute("width", currentWidth.toString());
            element.setAttribute("height", currentHeight.toString());
        });
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
        this.updateRects(); // Вызываем метод для обновления положений и размеров прямоугольников
        // requestAnimationFrame(() => this.updateRects())
    }

    private setRectParams() {
        if (!this.currentRect) return;

        this.currentRect.setAttribute("x", String(this.startSVGPoint.x));
        this.currentRect.setAttribute("y", String(this.startSVGPoint.y));
        this.currentRect.setAttribute("width", "0");
        this.currentRect.setAttribute("height", "0");
        this.currentRect.setAttribute("stroke", "#ee82ee");
        this.currentRect.setAttribute("fill", "#ee82ee6b");
        this.currentRect.setAttribute("stroke-width", "1");
    }

    private createCircle(group: SVGGElement, x: number, y: number) {
        const svgns = "http://www.w3.org/2000/svg";
        const circle = document.createElementNS(svgns, "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("fill", "yellow");
        circle.setAttribute("r", "4");
        circle.setAttribute("stroke", "violet");
        group.appendChild(circle);
    }

    public setActiveType(type: "rectangle" | "zoom_move" | "opacity") {
        this.activeType = type;

        if (type === "rectangle") {
            this.isDrawing = true;
            this.isGrabbing = false;
            this.svg.style.cursor = "crosshair";
            return;
        }
        if (type === "zoom_move") {
            this.isDrawing = false;
            this.isGrabbing = false;
        }
    }

    private attachHoverListeners(): void {
        const rects = this.svg.querySelectorAll(".annotation_element");

        rects.forEach((rect) => {
            if (rect.getAttribute("handler") === "true") {
                rect.addEventListener("mouseleave", (e: any) => this.onRectLeave(e));
            } else {
                rect.setAttribute("handler", "true");
                rect.addEventListener("mouseenter", (e: any) => this.onRectHover(e));
                rect.addEventListener("mousedown", (e) => this.startDragging(e, rect));
            }
        });
    }

    private onRectHover(event: MouseEvent): void {
        const rect = event.target as SVGRectElement;
        const bbox = rect.getBBox();
        const startX = bbox.x;
        const startY = bbox.y;
        const width = bbox.width;
        const height = bbox.height;

        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "hover-circles");

        this.createCircle(group, startX, startY);
        this.createCircle(group, startX + width / 2, startY);
        this.createCircle(group, startX + width, startY);
        this.createCircle(group, startX, startY + height / 2);
        this.createCircle(group, startX + width, startY + height / 2);
        this.createCircle(group, startX, startY + height);
        this.createCircle(group, startX + width, startY + height);
        this.createCircle(group, startX + width / 2, startY + height);

        this.svg.appendChild(group);

        rect.addEventListener("mouseleave", () => this.onRectLeave(group));
        this.svg.style.cursor = "move";
    }

    private onRectLeave(group: SVGGElement): void {
        this.svg.style.cursor = "default";
        if (this.svg.contains(group)) {
            this.svg.removeChild(group);
        }
    }

    private startDragging(event: MouseEvent, rect: SVGRectElement): void {
        if (event.button !== 0) return; // Реагируем только на левую кнопку мыши

        const initialMouseX = event.clientX;
        const initialMouseY = event.clientY;
        const rectStartX = parseFloat(rect.getAttribute("x")!);
        const rectStartY = parseFloat(rect.getAttribute("y")!);
        let newX: any;
        let newY: any;

        const moveHandler = (moveEvent: MouseEvent) => {
            // Вычисляем смещение, учитывая масштаб
            const dx = (moveEvent.clientX - initialMouseX) / this.scale;
            const dy = (moveEvent.clientY - initialMouseY) / this.scale;

            // Применяем смещение к начальным координатам элемента
            newX = rectStartX + dx;
            newY = rectStartY + dy;

            rect.setAttribute("x", newX.toString());
            rect.setAttribute("y", newY.toString());
        };

        const upHandler = () => {
            // При отпускании обновляем координаты в вашем массиве rects
            this.rects = this.rects.map((elem) => {
                if (elem.element === rect) {
                    return {
                        ...elem,
                        // startX: parseFloat(rect.getAttribute("x")!),
                        startX: parseFloat(newX),
                        startY: parseFloat(newY),
                        endX: parseFloat(rect.getAttribute("x")!) + elem.endX - elem.startX,
                        endY: parseFloat(rect.getAttribute("y")!) + elem.endY - elem.startY,
                    };
                }
                return elem;
            });

            window.removeEventListener("mousemove", moveHandler);
            window.removeEventListener("mouseup", upHandler);
        };

        window.addEventListener("mousemove", moveHandler);
        window.addEventListener("mouseup", upHandler);
    }
}
