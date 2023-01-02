import {
    SittingState,
    RunningState,
    JumpingState,
    FallingState
} from "./playerStates.js";


export class Player {
    constructor(game) {
        this.game = game;

        this.image = playerImage;
        this.width = 100;
        this.height = 91.3;

        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;

        this.states = [
            new SittingState(this),
            new RunningState(this),
            new JumpingState(this),
            new FallingState(this)
        ];
        this.setState(0, 0);

        this.frameX = 0;
        this.maxFrameX = 0;
        this.frameY = 5;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;

        this.speed = 0;
        this.maxSpeed = 5;
        this.vy = 0;
        this.weight = 1;
    }

    update(input, deltaTime) {
        this.currentState.handleInput(input);

        // Horizontal movement
        this.x += this.speed;
        if(input.has('ArrowRight')) this.speed = this.maxSpeed;
        else if(input.has('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;

        if(this.x < 0) this.x = 0;
        else if(this.x > this.game.width - this.width)
            this.x = this.game.width - this.width;

        // Vertical movement
        this.y += this.vy;

        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // Underground fall check
        if(this.y > this.game.height - this.height)
            this.y = this.game.height - this.height;

        // Sprite animation
        if(this.frameTimer > this.frameInterval) {
            if(this.frameX < this.maxFrameX) this.frameX++;
            else this.frameX = 0;

            this.frameTimer = 0;
        }
        else this.frameTimer += deltaTime;
    }

    draw(context) {
        context.drawImage(
            this.image,
            this.frameX * this.width, this.frameY * this.height,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height
        );
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
}
