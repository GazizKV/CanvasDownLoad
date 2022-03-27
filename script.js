const fileInput = document.getElementById('file-input');
let brightness = document.getElementById('brightness');
let contrast = document.getElementById('contrast');
let transparent = document.getElementById('transparent');
let canvasOne = document.getElementById('canvas_id');
let originImagePixel;
let image = new Image();
let saveButton = document.getElementById('save-button');
let file;
let reader;

saveButton.addEventListener('click', function () {
    let tmpLink = document.createElement('a');
    tmpLink.download = "result.png";
    tmpLink.href = canvasOne.toDataURL();
    tmpLink.click();
    tmpLink.delete;
});

fileInput.addEventListener('change', function (ev) {
    if (ev.target.files) {
        file = ev.target.files[0];
        reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            image.src = e.target.result;
            image.onload = function (ev) {
                canvasOne.width = image.width;
                canvasOne.height = image.height;
                let context = canvasOne.getContext('2d');
                context.drawImage(image, 0, 0);
                let imageData = context.getImageData(0, 0, canvasOne.width, canvasOne.height);
                originImagePixel = [...imageData.data];
            }
        }
        brightness.value = 0;
        contrast.value = 0;
        transparent.value = 1.0;
    }
});

function process() {
    let ctx = canvasOne.getContext('2d');
    let imgData = ctx.getImageData(0, 0, canvasOne.width, canvasOne.height);
    let currentBrightness = Number(brightness.value);
    let currentContrast = Number(contrast.value);
    let currentTransparent = Number(transparent.value);

    document.getElementById('brightness_value').valueOf().innerHTML = "current = " + currentBrightness;
    document.getElementById('contrast_value').valueOf().innerHTML = "current = " + currentContrast;
    document.getElementById('transparent_value').valueOf().innerHTML = "current = " + currentTransparent;

    let pixels = imgData.data;
    let factor = (259 * (255 + currentContrast)) / (255 * (259 - currentContrast));
    for (let i = 0; i < pixels.length; i = i + 4) {
        pixels[i] = Truncate((factor * (originImagePixel[i] - 128) + 128) + currentBrightness);
        pixels[i + 1] = Truncate((factor * (originImagePixel[i + 1] - 128) + 128) + currentBrightness);
        pixels[i + 2] = Truncate((factor * (originImagePixel[i + 2] - 128) + 128) + currentBrightness);
        pixels[i + 3] = originImagePixel[i + 3] * currentTransparent;
    }
    ctx.putImageData(imgData, 0, 0);
}

brightness.addEventListener('change', process);
contrast.addEventListener('change', process);
transparent.addEventListener('change', process);

function Truncate(value) {
    if (value > 255) {
        return 255;
    } else if (value < 0) {
        return  0;
    } else {
        return value;
    }
}
