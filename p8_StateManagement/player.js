import {
    StandingLeftState,
    StandingRightState,
    SittingLeftState,
    SittingRightState,
    RunningLeftState,
    RunningRightState,
    JumpingLeftState,
    JumpingRightState,
    FallingLeftState,
    FallingRightState
} from "./state.js";


export default class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.image = dogImage;
        this.width = 200;
        this.height = 181.83;

        this.states = [
            new StandingLeftState(this),
            new StandingRightState(this),
            new SittingLeftState(this),
            new SittingRightState(this),
            new RunningLeftState(this),
            new RunningRightState(this),
            new JumpingLeftState(this),
            new JumpingRightState(this),
            new FallingLeftState(this),
            new FallingRightState(this)
        ];
        this.currentState = this.states[1];

        this.x = this.gameWidth/2 - this.width/2;
        this.y = this.gameHeight - this.height;

        this.frameX = 0;
        this.maxFrameX = 5;
        this.frameY = 0;
        this.fps = 30;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;

        this.speed = 0;
        this.maxSpeed = 10;
        this.vy = 0;
        this.weight = 0.5;
    }

    update(input) {
        this.currentState.handleInput(input);

        // Horizontal movement
        this.x += this.speed;
        if (this.x <= 0) this.x = 0;
        else if (this.x > this.gameWidth - this.width)
            this.x = this.gameWidth - this.width;

        // Vertical movement
        this.y += this.vy;
        if(!this.onGround()) {
            this.vy += this.weight;
        }
        else this.vy = 0;

        if(this.y > this.gameHeight - this.height)
            this.y = this.gameHeight - this.height;
    }

    draw(context, deltaTime) {
        if(this.frameTimer > this.frameInterval) {
            if(this.frameX < this.maxFrameX)
                this.frameX++;
            else this.frameX = 0;

            this.frameTimer = 0;
        }
        else this.frameTimer += deltaTime;

        context.drawImage(
            this.image,
            this.width * this.frameX, this.height * this.frameY,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height
        );
    }

    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }

    onGround() {
         return this.y >= this.gameHeight - this.height;
    }
};
