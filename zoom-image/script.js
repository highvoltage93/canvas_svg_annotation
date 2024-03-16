document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "./file.jpg"; // Замените на путь к вашему изображению
    let scale;
    let start = { x: 0, y: 0 };

    img.onload = () => {
        scale = fitImageOnCanvas(
            img.width,
            img.height,
            canvas.width,
            canvas.height
        );
        drawImage(scale);
    };

    function fitImageOnCanvas(imgWidth, imgHeight, canvasWidth, canvasHeight) {
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        return Math.min(scaleX, scaleY); // Выбираем наименьший масштаб, чтобы изображение поместилось целиком
    }

    function drawImage(
        newScale,
        mouseX = canvas.width / 2,
        mouseY = canvas.height / 2
    ) {
        const imgWidth = img.width * newScale;
        const imgHeight = img.height * newScale;
        const x = mouseX - (mouseX - start.x) * (newScale / scale);
        const y = mouseY - (mouseY - start.y) * (newScale / scale);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, imgWidth, imgHeight);

        start = { x, y };
        scale = newScale;
    }

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;
        const delta = e.deltaY > 0 ? -1 : 1;
        const zoomIntensity = 0.05; // Уменьшаем скорость зума, изменяя этот коэффициент
        const newScale = Math.max(scale + delta * zoomIntensity, 0.1); // Применяем меньший коэффициент для более плавного зума
        drawImage(newScale, mouseX, mouseY);
    });
});
