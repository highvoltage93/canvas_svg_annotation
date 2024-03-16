document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = './file.jpg'; 
    let scale = 1
    let start = { x: 0, y: 0 }
    let draggedStart = { x: 0, y: 0 };
    let drag = false;

    console.log('scale',scale)

    img.onload = () => {
        scale = fitImageOnCanvas(img.width, img.height, canvas.width, canvas.height);
        drawImage();
    };

    function fitImageOnCanvas(imgWidth, imgHeight, canvasWidth, canvasHeight) {
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        return Math.min(scaleX, scaleY);
    }

    function drawImage() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        ctx.drawImage(img, start.x, start.y, imgWidth, imgHeight);
    }

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;
        const delta = e.deltaY > 0 ? -1 : 1;
        const zoomIntensity = 0.05;
        const newScale = Math.max(scale + delta * zoomIntensity, 0.1);
        const newWidth = img.width * newScale;
        const newHeight = img.height * newScale;
        start.x -= (mouseX - start.x) * (newScale - scale) / scale;
        start.y -= (mouseY - start.y) * (newScale - scale) / scale;
        scale = newScale;
        drawImage();
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
            drawImage();
        }
    });

    canvas.addEventListener('mouseup', () => {
        drag = false;
    });

    canvas.addEventListener('mouseleave', () => {
        drag = false;
    });
});
