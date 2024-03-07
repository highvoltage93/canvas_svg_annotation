const canvas = document.getElementById("canvas");
const navbar = document.getElementById("nav");
let imageWidth = 400; // Image width
let imageHeight = 400; // Image height

let ctx = canvas.getContext("2d");
let img = new Image();
img.src = "./file.jpg"; // Убедитесь, что путь к изображению корректен

function create_node() {
    const create_element = document.createElement("span");
    navbar.appendChild(create_element);

    return create_element;
}

let client_x = create_node();
let offset_left = create_node();

let xPos = (canvas.width - imageWidth) / 2; // Центрируем изображение по горизонтали
let yPos = (canvas.height - imageHeight) / 2; // Центрируем изображение по вертикали
let dragging = false;
let dragStartX, dragStartY;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, xPos, yPos, imageWidth, imageHeight);
}

img.onload = draw;


canvas.addEventListener("mousedown", function (e) {
    document.body.style.cursor = "pointer";

    let mouseX = e.clientX - canvas.offsetLeft;
    let mouseY = e.clientY - canvas.offsetTop;
    // Проверяем, находится ли курсор над изображением
   
    if (
        mouseX > xPos &&
        mouseX < xPos + imageWidth &&
        mouseY > yPos &&
        mouseY < yPos + imageHeight
    ) {
        dragging = true;
        dragStartX = mouseX - xPos;
        dragStartY = mouseY - yPos;
    }
});

window.addEventListener("mousemove", function (e) {
    if (dragging) {
        // e.clientX: Координата X курсора мыши относительно окна браузера в момент события.
        // canvas.offsetLeft: Горизонтальное смещение канваса относительно левого края документа.
        //      Используется для корректировки координаты xPos изображения, чтобы учесть положение канваса на странице.

        client_x.textContent = `e.clientX: ${e.clientX}`;
        offset_left.textContent = `canvas.offsetLeft: ${canvas.offsetLeft}`;
        console.log(e)
        let newX = e.clientX - canvas.offsetLeft - dragStartX;
        let newY = e.clientY - canvas.offsetTop - dragStartY;

        // Ограничиваем перемещение по X
        if (newX < 0) {
            newX = 0;
        } else if (newX + imageWidth > canvas.width) {
            newX = canvas.width - imageWidth;
        }

        // Ограничиваем перемещение по Y
        if (newY < 0) {
            newY = 0;
        } else if (newY + imageHeight > canvas.height) {
            newY = canvas.height - imageHeight;
        }

        xPos = newX;
        yPos = newY;

        draw();
    }
});

window.addEventListener("mouseup", function () {
    document.body.style.cursor = "default";
    dragging = false;
});
