import app from '../index';
import Scene from '../scene';
import Panel from './panel';
import Button from './button';
import {
    Text,
    TextStyle
} from 'pixi.js';

export default class PuzzleScene extends Scene {
    constructor({
        width,
        height,
        boardManager
    }) {
        super();

        let text, puzzleSprite;
        let tileset = app.loader.resources['tileset'].textures;

        this.panel = new Panel({
            width: 500,
            height: 400,
            backdropWidth: width,
            backdropHeight: height
        });

        let textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 'bold',
            wordWrap: true,
            wordWrapWidth: this.panel.width / 2,
            align: 'center'
        });

        // show previous image btn
        this.prevBtn = new Button({
            width: 50,
            height: 60,
            icon: tileset['left.png'],
            idleTexture: tileset['green_button_idle.png'],
            hoverTexture: tileset['green_button_hover.png'],
            clickTexture: tileset['green_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {

            }
        });
        this.prevBtn.position.set(10, this.panel.h / 2 - 25);
        this.panel.body.addChild(this.prevBtn);

        // show next image btn
        this.nextBtn = new Button({
            width: 50,
            height: 60,
            icon: tileset['right.png'],
            idleTexture: tileset['green_button_idle.png'],
            hoverTexture: tileset['green_button_hover.png'],
            clickTexture: tileset['green_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {

            }
        });
        this.nextBtn.position.set(this.panel.w - 60, this.panel.h / 2 - 25);
        this.panel.body.addChild(this.nextBtn);

        // aplly btn
        this.okBtn = new Button({
            text: 'OK',
            width: 100,
            height: 50,
            idleTexture: tileset['green_button_idle.png'],
            hoverTexture: tileset['green_button_hover.png'],
            clickTexture: tileset['green_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {

            }
        });
        this.okBtn.position.set(10, 50);
        this.panel.body.addChild(this.okBtn);

        // cancel btn
        this.cancelBtn = new Button({
            text: 'CANCEL',
            width: 100,
            height: 50,
            idleTexture: tileset['green_button_idle.png'],
            hoverTexture: tileset['green_button_hover.png'],
            clickTexture: tileset['green_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                this.hide();
            }
        });
        this.cancelBtn.position.set(110, 50);
        this.panel.body.addChild(this.cancelBtn);

        this.panel.putCenter();
        this.addChild(this.panel);
    }

    update(delta) {

    }
}