window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 720;
    const fullScreenButton = document.getElementById('fullScreenButton');

    const KEY_SPACE = ' ';
    const KEY_A = 'a';
    const KEY_D = 'd';
    const SWIPE_UP = 'swipe up';
    const SWIPE_DOWN = 'swipe down';

    let enemies = [];
    let score = 0;
    let gameOver = false;


    class InputHandler {
        constructor() {
            this.keys = new Set();
            this.allowedKeys = [
                KEY_SPACE,
                KEY_A,
                KEY_D,
                SWIPE_UP,
                SWIPE_DOWN
            ];

            this.touchY = '';
            this.touchTreshold = 30;

            window.addEventListener('keydown', (e) => {
                const key = e.key.toLowerCase();
                if (this.allowedKeys.includes(key)){
                    this.keys.add(key);
                }

                if (key === 'enter' && gameOver)
                    restartGame();
            });
            window.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
                if (this.allowedKeys.includes(key)){
                    this.keys.delete(key);
                }
            });

            window.addEventListener('touchstart', (e) => {
                this.touchY = e.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove', (e) => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.touchTreshold)
                    this.keys.add(SWIPE_UP);
                else if (swipeDistance > this.touchTreshold) {
                    this.keys.add(SWIPE_DOWN);
                    if (gameOver) restartGame();
                }
            });
            window.addEventListener('touchend', (e) => {
                this.keys.delete(SWIPE_UP);
                this.keys.delete(SWIPE_DOWN);
            });
        }
    }


    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;

            this.image = playerImage;
            this.width = 200;
            this.height = 200;

            this.x = 0;
            this.groundY = this.gameHeight - this.height;
            this.y = this.groundY;

            this.speed = 0;
            this.vy = 0;
            this.weight = 1;

            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
        }

        draw(context) {
            context.beginPath();
            context.arc(
                this.x + this.width*0.5,
                this.y + this.height*0.5+20,
                this.width*0.33,
                0, Math.PI*2
            );
            context.stroke();

            context.drawImage(
                this.image,
                this.frameX * this.width, this.frameY * this.height,
                this.width, this.height,
                this.x, this.y,
                this.width, this.height
            );
        }

        update(input, deltaTime, enemies) {
            // Collision
            for (const enemy of enemies) {
                const dx = (enemy.x + enemy.width*0.5-20) - (this.x + this.width*0.5);
                const dy = (enemy.y + enemy.height*0.5) - (this.y + this.height*0.5+20);
                const distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < enemy.width*0.33 + this.width*0.33)
                    gameOver = true;
            }

            // Sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;

                this.frameTimer = 0;
            }
            else this.frameTimer += deltaTime;

            // Movement keys
            if (input.keys.has(KEY_D)) {
                this.speed = 5;
            }
            else if (input.keys.has(KEY_A)) {
                this.speed = -5;
            }
            else if ((
                input.keys.has(KEY_SPACE) ||
                input.keys.has(SWIPE_UP)
                ) &&
                this.onGround())
            {
                this.vy -= 30;
            }
            else {
                this.speed = 0;
            }

            // Horizontal movement
            this.x += this.speed;
            if (this.x < 0) {
                this.x = 0;
            }
            else if (this.x > this.gameWidth - this.width) {
                this.x = this.gameWidth - this.width;
            }

            // Vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.maxFrame = 5;

                this.vy += this.weight;
                this.frameY = 1;
            }
            else {
                this.maxFrame = 5;
                this.vy = 0;
                this.frameY = 0;
            }

            if (this.y > this.groundY) {
                this.y = this.groundY;
            }
        }

        onGround() {
            return this.y >= this.groundY;
        }

        restart() {
            this.x = 0;
            this.y = this.groundY;
            this.maxFrame = 8;
            this.frameY = 0;
        }
    }


    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;

            this.image = backgroundImage;

            this.x = 0;
            this.y = 0;

            this.width = 2400;
            this.height = 720;

            this.speed = 3;
        }

        draw(context) {
            context.drawImage(
                this.image,
                this.x, this.y,
                this.width, this.height,
            );
            context.drawImage(
                this.image,
                this.x + this.width - this.speed, this.y,
                this.width, this.height,
            );
        }

        update() {
            this.x -= this.speed;

            if (this.x < 0 - this.width) this.x = 0;
        }

        restart() {
            this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;

            this.image = enemy1Image;

            this.width = 160;
            this.height = 119;

            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;

            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;

            this.speed = 4;

            this.markedForDeletion = false;
        }

        draw(context) {
            context.beginPath();
            context.arc(
                this.x + this.width*0.5-20,
                this.y + this.height*0.5,
                this.width*0.33,
                0, Math.PI*2
            );
            context.stroke();

            context.drawImage(
                this.image,
                this.frameX * this.width, 0,
                this.width, this.height,
                this.x, this.y,
                this.width, this.height
            );
        }

        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;

                this.frameTimer = 0;
            }
            else this.frameTimer += deltaTime;

            this.x -= this.speed;

            if (this.x < 0 - this.width && !this.markedForDeletion) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }


    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));

            enemyTimer = 0;
            enemies = enemies.filter(enemy => !enemy.markedForDeletion);
        }
        else {
            enemyTimer += deltaTime;
        }

        for (const enemy of enemies) {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        }
    }


    function displayStatusText(context) {
        context.textAlign = 'left';
        context.fillStyle = 'black';
        context.font = '40px Helvetica';
        context.fillText(`Score: ${score}`, 20, 50);
        context.fillStyle = 'white';
        context.font = '40px Helvetica';
        context.fillText(`Score: ${score}`, 22, 52);

        if (gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText(
                'Game over, press Enter or Swipe Down to try again',
                canvas.width/2,
                canvas.height/2
            );
            context.fillStyle = 'white';
            context.fillText(
                'Game over, press Enter or Swipe Down to try again',
                canvas.width/2+2,
                canvas.height/2+2
            );
        }

    }
    
    
    function restartGame() {
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate();
    }


    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen()
                .catch(err => alert(`Error, cant enable full-screen mode: ${err.message}`));
        }
        else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen);

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp=0) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        background.update();
        background.draw(ctx);

        player.update(input, deltaTime, enemies);
        player.draw(ctx);

        handleEnemies(deltaTime);
        displayStatusText(ctx);

        if (!gameOver)
            requestAnimationFrame(animate);
    }

    animate();
});
