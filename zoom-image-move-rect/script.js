document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = './file.jpg'; // Замените на путь к вашему изображению
    let scale = 1, start = { x: 0, y: 0 }, draggedStart = { x: 0, y: 0 };
    let drag = false;
    // Позиция и размеры прямоугольника относительно изображения
    let rect = { x: 1550, y: 1950, width: 200, height: 200 }; // Примерные начальные значения
    let rect2 = { x: 1950, y: 1250, width: 600, height: 600 }; // Примерные начальные значения

    img.onload = () => {
        scale = fitImageOnCanvas(img.width, img.height, canvas.width, canvas.height);
        drawScene();
    };

    function fitImageOnCanvas(imgWidth, imgHeight, canvasWidth, canvasHeight) {
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        return Math.min(scaleX, scaleY);
    }

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        ctx.drawImage(img, start.x, start.y, imgWidth, imgHeight);
        // Рисуем прямоугольник в указанной позиции относительно изображения
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Задаем цвет и прозрачность для прямоугольника
        ctx.fillRect(start.x + rect.x * scale, start.y + rect.y * scale, rect.width * scale, rect.height * scale);
        ctx.fillRect(start.x + rect2.x * scale, start.y + rect2.y * scale, rect2.width * scale, rect2.height * scale);
    }

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;
        const delta = e.deltaY > 0 ? -1 : 1;
        const zoomIntensity = 0.05;
        const newScale = Math.max(scale + delta * zoomIntensity, 0.1);
        start.x -= (mouseX - start.x) * (newScale - scale) / scale;
        start.y -= (mouseY - start.y) * (newScale - scale) / scale;
        scale = newScale;
        drawScene();
    });

    canvas.addEventListener('mousedown', (e) => {
        draggedStart.x = e.clientX - start.x;
        draggedStart.y = e.clientY - start.y;
        drag = true;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (drag) {
            start.x = e.clientX - draggedStart.x;
            start.y = e.clientY - draggedStart.y;
            drawScene();
        }
    });

    canvas.addEventListener('mouseup', () => {
        drag = false;
    });

    canvas.addEventListener('mouseleave', () => {
        drag = false;
    });
});
