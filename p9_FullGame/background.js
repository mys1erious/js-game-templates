class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;

        this.image = image;

        this.x = 0;
        this.y = 0;
    }

    update() {
        if(this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }

    draw(context) {
        context.drawImage(
            this.image,
            this.x, this.y,
            this.width, this.height
        );
        context.drawImage(
            this.image,
            this.x + this.width, this.y,
            this.width, this.height
        );
    }
}


export class Background {
    constructor(game) {
        this.game = game;
        this.width = 1667;
        this.height = 500;

        this.backgroundLayers = [
            new Layer(game, this.width, this.height, 0, bgLayer1Image),
            new Layer(game, this.width, this.height, 0.2, bgLayer2Image),
            new Layer(game, this.width, this.height, 0.4, bgLayer3Image),
            new Layer(game, this.width, this.height, 0.8, bgLayer4Image),
            new Layer(game, this.width, this.height, 1, bgLayer5Image),
        ];
    }

    update() {
        for (const layer of this.backgroundLayers)
            layer.update();
    }

    draw(context) {
        for (const layer of this.backgroundLayers)
            layer.draw(context);
    }
}
