import app from '../index';
import Scene from '../scene';
import Panel from './panel';
import Button from './button';
import {
    Text,
    TextStyle,
    Sprite
} from 'pixi.js';

export default class PuzzleScene extends Scene {
    constructor({
        width,
        height,
        boardManager
    }) {
        super();

        let sp = new Sprite(boardManager.texture),
            currIndex = 0,
            textures = this.getTextures(app.loader.resources),
            tileset = app.loader.resources['tileset'].textures;

        sp.width = sp.height = 350;
        sp.anchor.set(0.5);


        this.panel = new Panel({
            width: width,
            height: height,
            backdropWidth: app.view.width,
            backdropHeight: app.view.height
        });

        let textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 0xffffff
        });

        // show previous image btn
        this.prevBtn = new Button({
            width: 50,
            height: 60,
            icon: tileset['left.png'],
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                currIndex = currIndex - 1 < 0 ? 9 : currIndex - 1;
                sp.texture = textures[currIndex];
            }
        });
        this.prevBtn.position.set(10, this.panel.h / 2 - 25);
        this.panel.body.addChild(this.prevBtn);

        // show next image btn
        this.nextBtn = new Button({
            width: 50,
            height: 60,
            icon: tileset['right.png'],
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                currIndex = currIndex + 1 > 9 ? 0 : currIndex + 1;
                sp.texture = textures[currIndex];
            }
        });
        this.nextBtn.position.set(this.panel.w - 60, this.panel.h / 2 - 25);
        this.panel.body.addChild(this.nextBtn);

        // aplly btn
        this.okBtn = new Button({
            text: 'OK',
            width: 100,
            height: 50,
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                boardManager.setBackground(textures[currIndex])
                    .setPuzzleTexture(textures[currIndex]);
                this.hide();
            }
        });
        this.okBtn.position.set(
            this.panel.w - this.okBtn.w - 20,
            this.panel.h - this.okBtn.h - 20);
        this.panel.body.addChild(this.okBtn);

        // cancel btn
        this.cancelBtn = new Button({
            text: 'CANCEL',
            width: 100,
            height: 50,
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                this.hide();
            }
        });
        this.cancelBtn.position.set(
            this.panel.w - 2 * this.cancelBtn.w - 30,
            this.panel.h - this.cancelBtn.h - 20);
        this.panel.body.addChild(this.cancelBtn);

        sp.position.set(this.panel.w / 2, sp.height / 2 + 50);
        this.panel.body.addChild(sp);

        this.panel.putCenter();
        this.addChild(this.panel);
    }

    getTextures(resources) {
        let textures = [];

        for (let i = 1; i <= 10; i++) {
            textures.push(resources[`puzzle-${ i < 10 ? '0' + i : i}`].texture);
        }
        return textures;
    }

    update(delta) {

    }
}