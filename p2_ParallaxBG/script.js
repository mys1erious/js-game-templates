const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 3;
let gameFrame = 0;


class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    };

    update() {
        this.speed = gameSpeed * this.speedModifier;
        // if (this.x <= -this.width)
        //     this.x = 0;
        // this.x = Math.floor(this.x - this.speed);

        // Fix jumps ?
        this.x = gameFrame * this.speed % this.width;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

const bgImagePaths = [
    'static/layer-1.png',
    'static/layer-2.png',
    'static/layer-3.png',
    'static/layer-4.png',
    'static/layer-5.png'
];
const bgImages = [];
for (let path of bgImagePaths){
    const img = new Image();
    img.src = path;
    bgImages.push(img);
}


window.addEventListener('load', function() {
    let slider = document.getElementById('slider');
    slider.value = gameSpeed;

    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerHTML = gameSpeed.toString();

    slider.addEventListener('change', function(e) {
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = gameSpeed.toString();
    });

    const layers = [
        new Layer(bgImages[0], 0.2),
        new Layer(bgImages[1], 0.4),
        new Layer(bgImages[2], 0.6),
        new Layer(bgImages[3], 0.8),
        new Layer(bgImages[4], 1)
    ];

    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        for (let layer of layers){
            layer.update();
            layer.draw();
        }

        gameFrame--;
        requestAnimationFrame(animate);
    }
    animate();
});


