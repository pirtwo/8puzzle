import Scene from '../scene';
import {
    Text,
    Sprite
} from 'pixi.js';

export default class Button extends Scene {
    constructor({
        text = '',
        width,
        height,
        textStyle,
        icon = null,
        idleTexture,
        hoverTexture,
        clickTexture,
        clickSound,
        clickCallback
    }) {
        super();

        this.w = width;
        this.h = height;
        this.clickSound = clickSound;
        this.idleTexture = idleTexture;
        this.hoverTexture = hoverTexture;
        this.clickTexture = clickTexture;
        this.clickCallback = clickCallback;
        
        this.sprite = new Sprite(idleTexture);
        this.sprite.width = this.w;
        this.sprite.height = this.h;

        if (text) {
            this.text = new Text(text, textStyle);
            this.text.anchor.set(0.5);
            this.text.position.set(this.w / 2, this.h / 2);
        }

        if (icon) {
            this.icon = new Sprite(icon);
            this.icon.width = this.icon.height = this.w / 1.3;
            this.icon.anchor.set(0.5);
            this.icon.position.set(this.w / 2, this.h / 2 - 5);
        }

        this.addChild(this.sprite);
        if (text) this.addChild(this.text);
        if (icon) this.addChild(this.icon);

        this.interactive = true;
        this.buttonMode = true;
        this.on('click', this.clickCallback);
        this.on('pointerdown', (e) => {
            this.clickSound.play();
            this.sprite.texture = this.clickTexture;
        });
        this.on('pointerup', (e) => {
            this.sprite.texture = this.hoverTexture;
        });
        this.on('pointerover', (e) => {
            this.sprite.texture = this.hoverTexture;
        });
        this.on('pointerout', (e) => {
            this.sprite.texture = this.idleTexture;
        });
    }
}