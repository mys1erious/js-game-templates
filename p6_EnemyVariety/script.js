document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 800;


    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;

            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = [
                WormEnemy,
                GhostEnemy,
                SpiderEnemy
            ];
        }

        update(deltaTime) {
            if (this.enemyTimer > this.enemyInterval){
                this.#addNewEnemy();
                this.#cleanupEnemies();
                // this.#arrangeEnemies();

                this.enemyTimer = 0;
                console.log(this.enemies)
            }
            else {
                this.enemyTimer += deltaTime;
            }

            for (const enemy of this.enemies) enemy.update(deltaTime);
        }

        draw() {
            for (const enemy of this.enemies) enemy.draw(this.ctx);
        }

        #addNewEnemy() {
            const Enemy = this.enemyTypes[Math.floor(
                Math.random() * this.enemyTypes.length
            )];
            this.enemies.push(new Enemy(this));
        }

        #cleanupEnemies() {
            this.enemies = this.enemies.filter(
                enemy => !enemy.markedForDeletion
            );
        }

        #arrangeEnemies() {
            this.enemies.sort((a, b) => a.y - b.y);
        }
    }


    class Enemy {
        constructor(game) {
            this.game = game;
            this.markedForDeletion = false;

            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }

        update(deltaTime) {
            this.x -= this.vx * deltaTime;

            this.markForDeletion();

            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;

                this.frameTimer = 0;
            }
            else this.frameTimer += deltaTime;
        }

        draw(ctx) {
            ctx.drawImage(
                this.image,
                this.frameX * this.spriteWidth, 0,
                this.spriteWidth, this.spriteHeight,
                this.x, this.y,
                this.width, this.height
            );
        }

        markForDeletion() {
            if (this.x < 0 - this.width)
                this.markedForDeletion = true;
        }
    }


    class WormEnemy extends Enemy {
        constructor(game) {
            super(game);

            this.image = wormImage;
            this.spriteWidth = 229;
            this.spriteHeight = 171;

            this.width = this.spriteWidth/2;
            this.height = this.spriteHeight/2;

            this.x = this.game.width;
            this.y = this.game.height - this.height;

            this.vx = Math.random() * 0.1 + 0.1;
        }
    }


    class GhostEnemy extends Enemy {
        constructor(game) {
            super(game);

            this.image = ghostImage;
            this.spriteWidth = 261;
            this.spriteHeight = 209;

            this.width = this.spriteWidth/2;
            this.height = this.spriteHeight/2;

            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.6;

            this.vx = Math.random() * 0.2 + 0.1;
            this.angle = 0;
            this.curve = Math.random() * 3;
        }

        update(deltaTime) {
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }

        draw(ctx) {
            ctx.save();

            ctx.globalAlpha = 0.4;
            super.draw(ctx);

            ctx.restore();
        }
    }


    class SpiderEnemy extends Enemy {
        constructor(game) {
            super(game);

            this.image = spiderImage;
            this.spriteWidth = 310;
            this.spriteHeight = 175;

            this.width = this.spriteWidth/3;
            this.height = this.spriteHeight/3;

            this.x = Math.random() * this.game.width;
            this.y = 0 - this.height;

            this.vx = 0;
            this.vy = Math.random() * 0.1 + 0.1;

            this.maxLength = Math.random() * this.game.height;
        }

        update(deltaTime) {
            super.update(deltaTime);
            this.y += this.vy * deltaTime;

            if (this.y > this.maxLength) this.vy = -this.vy;
        }

        draw(ctx) {
            this.#drawWeb();
            super.draw(ctx);
        }

        #drawWeb() {
            const x = this.x + this.width/2;

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.y + 10);
            ctx.stroke();
        }

        markForDeletion() {
            if (this.y < 0 - this.height*2)
                this.markedForDeletion = true;
        }
    }


    const game = new Game(ctx, canvas.width, canvas.height);

    let lastTime = 1;
    function animate(timeStamp=0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw();

        requestAnimationFrame(animate);
    }

    animate();
});
