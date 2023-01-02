const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3
}


class State {
    constructor(state) {
        this.state = state;
    }
    enter() {}
    handleInput() {}
}


export class SittingState extends State {
    constructor(player) {
        super('SITTING');

        this.player = player;
    }

    enter() {
        this.player.frameX = 0;
        this.player.maxFrameX = 4;
        this.player.frameY = 5;
    }

    handleInput(input) {
        if(input.has('ArrowLeft') || input.has('ArrowRight')) {
            this.player.setState(states.RUNNING, 1);
        }
    }
}


export class RunningState extends State {
    constructor(player) {
        super('RUNNING');

        this.player = player;
    }

    enter() {
        this.player.frameX = 0;
        this.player.maxFrameX = 6;
        this.player.frameY = 3;
    }

    handleInput(input) {
        if(input.has('ArrowDown'))
            this.player.setState(states.SITTING, 0);
        else if(input.has('ArrowUp'))
            this.player.setState(states.JUMPING, 1);
    }
}


export class JumpingState extends State {
    constructor(player) {
        super('JUMPING');

        this.player = player;
    }

    enter() {
        this.player.frameX = 0;
        this.player.maxFrameX = 6;

        if (this.player.onGround())
            this.player.vy -= 26;
        this.player.frameY = 1;
    }

    handleInput(input) {
        if(this.player.vy > this.player.weight) {
            this.player.setState(states.FALLING, 1);
        }
    }
}


export class FallingState extends State {
    constructor(player) {
        super('FALLING');

        this.player = player;
    }

    enter() {
        this.player.frameX = 0;
        this.player.maxFrameX = 6;
        this.player.frameY = 2;
    }

    handleInput(input) {
        if(this.player.onGround()) {
            this.player.setState(states.RUNNING, 1);
        }
    }
}
