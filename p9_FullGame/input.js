export class InputHandler {
    constructor() {
        this.keys = new Set();
        this.allowedKeys = [
            'ArrowDown',
            'ArrowUp',
            'ArrowLeft',
            'ArrowRight',
            ' '
        ];

        window.addEventListener('keydown', e => {
            if(this.allowedKeys.includes(e.key))
                this.keys.add(e.key);
            console.log(this.keys);
        });

        window.addEventListener('keyup', e => {
            if(this.allowedKeys.includes(e.key))
                this.keys.delete(e.key);
            console.log(this.keys);
        });
    }
}
