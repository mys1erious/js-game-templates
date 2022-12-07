/** @type {HTMLCanvasElement} **/


// Rework for base enemy and make each enemy type as a child


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
const NUM_OF_ENEMIES = 10;

let gameFrame = 0;


class Enemy1 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy1.png';

        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);
    }

    update() {
        this.x += Math.random() * 15 - 7.5;
        this.y += Math.random() * 15 - 7.5;

        if (gameFrame % this.flapSpeed === 0)
            this.frame > 4 ? this.frame = 0 : this.frame++;
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y,
            this.width, this.height
        );
    }
}


class Enemy2 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy2.png';

        this.speed = Math.random() * 4 + 1;

        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 7;
    }

    update() {
        this.x -= this.speed;
        this.y += Math.sin(this.angle) * this.curve;
        this.angle += this.angleSpeed;

        if (this.x + this.width < 0)
            this.x = canvas.width;

        if (gameFrame % this.flapSpeed === 0)
            this.frame > 4 ? this.frame = 0 : this.frame++;
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y,
            this.width, this.height
        );
    }
}


class Enemy3 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy3.png';

        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.x = Math.sin(this.angle * Math.PI/90) * canvas.width/2 +
            (canvas.width/2 - this.width/2);
        this.y = Math.cos(this.angle * Math.PI/270) * canvas.height/2 +
            (canvas.height/2 - this.height/2);

        this.angle += this.angleSpeed;

        if (this.x + this.width < 0)
            this.x = canvas.width;

        if (gameFrame % this.flapSpeed === 0)
            this.frame > 4 ? this.frame = 0 : this.frame++;
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y,
            this.width, this.height
        );
    }
}


class Enemy4 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy4.png';

        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * canvas.width;
        this.newY = Math.random() * canvas.height;

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);
        this.interval = Math.floor(Math.random() * 200 + 50);
    }

    update() {
        if (gameFrame % this.interval === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }

        let dx = this.x - this.newX;
        let dy = this.y - this.newY;

        this.x -= dx/120;
        this.y -= dy/120;

        if (this.x + this.width < 0)
            this.x = canvas.width;

        if (gameFrame % this.flapSpeed === 0)
            this.frame > 4 ? this.frame = 0 : this.frame++;
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight,
            this.x, this.y,
            this.width, this.height
        );
    }
}


const enemies = [];
for (let i=0; i < NUM_OF_ENEMIES; i++){
    // enemies.push(new Enemy1());
    // enemies.push(new Enemy2());
    // enemies.push(new Enemy3());
    enemies.push(new Enemy4());
}


function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const enemy of enemies){
        enemy.update();
        enemy.draw();
    }

    gameFrame ++;
    requestAnimationFrame(animate);
}

animate();
