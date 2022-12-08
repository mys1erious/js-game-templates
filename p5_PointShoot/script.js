const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');


const CANVAS_WIDTH = canvas.width = collisionCanvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = collisionCanvas.height = window.innerHeight;

ctx.font = '50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let score = 0;
let gameOver = false;


let ravens = [];
class Raven {
    constructor() {
        this.image = new Image();
        this.image.src = 'raven.png';
        this.spriteWidth = 271;
        this.spriteHeight = 194;

        this.frame = 0;
        this.maxFrame = 4;

        this.randomColors = [
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
        ];
        this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;

        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;

        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);

        this.directionX = Math.random() * 1 + 3;
        this.directionY = Math.random() * 5 - 2.5;

        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;

        this.hasTrail = Math.random() > 0.5;

        this.markedForDeletion = false;
    }

    update(deltatime) {
        this.x -= this.directionX;
        if (this.x < 0 - this.width)
            gameOver = true;

        this.y += this.directionY;
        if (this.y < 0 || this.y > CANVAS_HEIGHT - this.height)
            this.directionY = -this.directionY;

        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame)
                this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;

            if (this.hasTrail)
                for (let i=0; i < 5; i++)
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
        }

        if (this.markedForDeletion)
            ravens = ravens.filter(obj => !obj.markedForDeletion);
    }

    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);

        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y,
            this.width, this.height
        );
    }
}


let explosions = [];
class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;

        this.frame = 0;
        this.maxFrame = 4;
        this.sound = new Audio('boom.wav');
        this.sound.volume = 0.05;
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;

        this.size = size * 0.5;
        this.x = x;
        this.y = y;
    }

    update(deltatime) {
        if (this.frame === 0)
            this.sound.play();

        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
        }

        if (this.frame > this.maxFrame)
            explosions = explosions.filter(obj => !obj.frame > obj.maxFrame);
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y,
            this.size, this.size
        );
    }
}


let particles = [];
class Particle {
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size/2 + Math.random() * 50 - 25;
        this.y = y + this.size/3  + Math.random() * 50 - 25;
        this.color = color;

        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 20;

        this.speedX = Math.random() * 1 + 0.5;
    }

    update() {
        this.x += this.speedX;

        this.radius += 0.2;
        if (this.radius > this.maxRadius-5)
            particles = particles.filter(obj => !(obj.radius > this.maxRadius));

    }

    draw() {
        ctx.save();

        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
    }
}


function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 55, 80);
}


function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(
        `Game Over, your score is : ${score}`,
        CANVAS_WIDTH/2,
        CANVAS_HEIGHT/2
    );
    ctx.fillStyle = 'white';
    ctx.fillText(
        `Game Over, your score is : ${score}`,
        CANVAS_WIDTH/2+5,
        CANVAS_HEIGHT/2+5
    );
}


window.addEventListener('click', function(e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;
    for (const raven of ravens) {
        if (raven.randomColors[0] === pc[0] &&
            raven.randomColors[1] === pc[1] &&
            raven.randomColors[2] === pc[2])
        {
            raven.markedForDeletion = true;
            explosions.push(new Explosion(raven.x, raven.y, raven.width));
            score++;
        }
    }
});


function animate(timestamp=0) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    collisionCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawScore();

    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;

    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort((a, b) => a.width - b.width);
    }

    for (let obj of [...particles, ...ravens, ...explosions]){
        obj.update(deltatime);
        obj.draw();
    }

    if (!gameOver)
        requestAnimationFrame(animate);
    else drawGameOver();
}

animate();
