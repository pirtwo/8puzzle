import Scene from '../scene';
import {
    Text,
    TextStyle,
    Sprite
} from 'pixi.js';

export default class Button extends Scene {
    constructor({
        text = '',
        width,
        height,
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

        let textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 'bold',
            wordWrap: true,
            wordWrapWidth: this.w / 2,
            align: 'center'
        });

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
            this.icon.width = 50;
            this.icon.height = 50;
            this.icon.anchor.set(0.5);
            this.icon.position.set(this.w / 2, this.h / 2 - 5);
        }

        this.addChild(this.sprite);
        if(text) this.addChild(this.text);
        if(icon) this.addChild(this.icon);

        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerdown', (e) => {
            this.clickSound.play();
            this.sprite.texture = this.clickTexture;            
        });
        this.on('pointerup', (e) => {
            this.sprite.texture = this.hoverTexture;
            this.clickCallback();
        });
        this.on('pointerover', (e) => {
            this.sprite.texture = this.hoverTexture;
        });
        this.on('pointerout', (e) => {
            this.sprite.texture = this.idleTexture;
        });
    }
}