const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width =  600;
const CANVAS_HEIGHT = canvas.height =  600;
const SPRITE_WIDTH = 575; // 6876 / 12 = 573 ( +2 for a margin fix)
const SPRITE_HEIGHT = 523 // 5230 / 10 = 523;


const playerImage = new Image();
playerImage.src = 'shadow_dog.png';

let gameFrame = 0;
const staggerFrames = 10;

const spriteAnimations = {};
const animationStates = [
    {
        name: 'idle',
        frames: 7
    },
    {
        name: 'jump',
        frames: 7
    },
    {
        name: 'fall',
        frames: 7
    },
    {
        name: 'run',
        frames: 9
    },
    {
        name: 'dizzy',
        frames: 11
    },
    {
        name: 'sit',
        frames: 5
    },
    {
        name: 'roll',
        frames: 7
    },
    {
        name: 'bite',
        frames: 7
    },
    {
        name: 'ko',
        frames: 12
    },
    {
        name: 'getHit',
        frames: 4
    }
];
animationStates.forEach((state, index) => {
    let frames = {
        loc: []
    };
    for (let i=0; i < state.frames; i++){
        let posX = i * SPRITE_WIDTH;
        let posY = index * SPRITE_HEIGHT;
        frames.loc.push({x: posX, y: posY});
    }

    spriteAnimations[state.name] = frames;
});

let playerState = 'fall';
const drowdown = document.getElementById('animations');
drowdown.addEventListener('change', function (e) {
    playerState = e.target.value;
});


function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let pos = Math.floor(gameFrame / staggerFrames) %
        spriteAnimations[playerState].loc.length;
    let frameX = spriteAnimations[playerState].loc[pos].x;
    let frameY = spriteAnimations[playerState].loc[pos].y;

    ctx.drawImage(
        playerImage,
        frameX, frameY,
        SPRITE_WIDTH, SPRITE_HEIGHT,
        0, 0,
        SPRITE_WIDTH, SPRITE_HEIGHT
    );

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();
