class CanvasImage {
    constructor(canvasId, imageUrl, imageWidth, imageHeight) {
        this.canvas = document.getElementById(canvasId);
        this.navbar = document.getElementById("nav");
        this.ctx = this.canvas.getContext("2d");
        this.img = new Image();
        this.img.src = imageUrl;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.xPos = (this.canvas.width - this.imageWidth) / 2;
        this.yPos = (this.canvas.height - this.imageHeight) / 2;
        this.dragging = false;

        this.img.onload = () => this.draw();

        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        window.addEventListener("mousemove", this.handleMouseMove.bind(this));
        window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    createNode() {
        const create_element = document.createElement("span");
        this.navbar.appendChild(create_element);
        return create_element;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img, this.xPos, this.yPos, this.imageWidth, this.imageHeight);
    }

    handleMouseDown(e) {
        document.body.style.cursor = "pointer";
        const mouseX = e.clientX - this.canvas.offsetLeft;
        const mouseY = e.clientY - this.canvas.offsetTop;

        if (mouseX > this.xPos && mouseX < this.xPos + this.imageWidth && mouseY > this.yPos && mouseY < this.yPos + this.imageHeight) {
            this.dragging = true;
            this.dragStartX = mouseX - this.xPos;
            this.dragStartY = mouseY - this.yPos;
        }
    }

    handleMouseMove(e) {
        if (this.dragging) {
            let newX = e.clientX - this.canvas.offsetLeft - this.dragStartX;
            let newY = e.clientY - this.canvas.offsetTop - this.dragStartY;

            newX = Math.max(0, Math.min(newX, this.canvas.width - this.imageWidth));
            newY = Math.max(0, Math.min(newY, this.canvas.height - this.imageHeight));

            this.xPos = newX;
            this.yPos = newY;
            this.draw();
        }
    }

    handleMouseUp() {
        document.body.style.cursor = "default";
        this.dragging = false;
    }
}

// Использование класса
const canvasImage = new CanvasImage("canvas", "./file.jpg", 900, 600);


// const canvas = document.getElementById("canvas");
// const navbar = document.getElementById("nav");
// let imageWidth = 900; // Image width
// let imageHeight = 600; // Image height

// let ctx = canvas.getContext("2d");
// let img = new Image();
// img.src = "./file.jpg"; // Убедитесь, что путь к изображению корректен

// function create_node() {
//     const create_element = document.createElement("span");
//     navbar.appendChild(create_element);

//     return create_element;
// }

// let client_x = create_node();
// let offset_left = create_node();

// let xPos = (canvas.width - imageWidth) / 2; // Центрируем изображение по горизонтали
// let yPos = (canvas.height - imageHeight) / 2; // Центрируем изображение по вертикали
// let dragging = false;
// let dragStartX, dragStartY;

// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(img, xPos, yPos, imageWidth, imageHeight);
// }

// img.onload = draw;


// canvas.addEventListener("mousedown", function (e) {
//     document.body.style.cursor = "pointer";

//     let mouseX = e.clientX - canvas.offsetLeft;
//     let mouseY = e.clientY - canvas.offsetTop;
//     // Проверяем, находится ли курсор над изображением
   
//     if (
//         mouseX > xPos &&
//         mouseX < xPos + imageWidth &&
//         mouseY > yPos &&
//         mouseY < yPos + imageHeight
//     ) {
//         dragging = true;
//         dragStartX = mouseX - xPos;
//         dragStartY = mouseY - yPos;
//     }
// });

// window.addEventListener("mousemove", function (e) {
//     if (dragging) {
//         // e.clientX: Координата X курсора мыши относительно окна браузера в момент события.
//         // canvas.offsetLeft: Горизонтальное смещение канваса относительно левого края документа.
//         //      Используется для корректировки координаты xPos изображения, чтобы учесть положение канваса на странице.

//         client_x.textContent = `e.clientX: ${e.clientX}`;
//         offset_left.textContent = `canvas.offsetLeft: ${canvas.offsetLeft}`;
//         console.log(e)
//         let newX = e.clientX - canvas.offsetLeft - dragStartX;
//         let newY = e.clientY - canvas.offsetTop - dragStartY;

//         // Ограничиваем перемещение по X
//         if (newX < 0) {
//             newX = 0;
//         } else if (newX + imageWidth > canvas.width) {
//             newX = canvas.width - imageWidth;
//         }

//         // Ограничиваем перемещение по Y
//         if (newY < 0) {
//             newY = 0;
//         } else if (newY + imageHeight > canvas.height) {
//             newY = canvas.height - imageHeight;
//         }

//         xPos = newX;
//         yPos = newY;

//         draw();
//     }
// });

// window.addEventListener("mouseup", function () {
//     document.body.style.cursor = "default";
//     dragging = false;
// });
