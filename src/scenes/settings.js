import app from '../index';
import Scene from '../scene';
import Panel from './panel';
import Button from './button';
import {
    Text,
    TextStyle
} from 'pixi.js';

export default class SettingScene extends Scene {
    constructor({
        width,
        height,
        boardManager
    }) {
        super();

        this.hasTileNumber = true;
        let uiSound = app.loader.resources.click.sound;
        let gameMusic = app.loader.resources.click.sound;

        let text;
        let tileset = app.loader.resources['tileset'].textures;

        this.panel = new Panel({
            width: 500,
            height: 500,
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

        this.soundButton = new Button({
            width: 50,
            height: 50,
            icon: tileset['audioOn.png'],
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                if (uiSound.muted) {
                    uiSound.muted = false;
                    this.soundButton.icon.texture = tileset['audioOn.png'];
                } else {
                    uiSound.muted = true;
                    this.soundButton.icon.texture = tileset['audioOff.png'];
                }
            }
        });
        this.soundButton.position.set(200, 10);
        this.panel.body.addChild(this.soundButton);

        this.musicButton = new Button({
            width: 50,
            height: 50,
            icon: tileset['musicOff.png'],
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                if (gameMusic.muted) {
                    gameMusic.muted = false;
                    this.musicButton.icon.texture = tileset['musicOn.png'];
                } else {
                    gameMusic.muted = true;
                    this.musicButton.icon.texture = tileset['musicOff.png'];
                }
            }
        });
        this.musicButton.position.set(200, 70);
        this.panel.body.addChild(this.musicButton);

        this.tileNumberButton = new Button({
            width: 50,
            height: 50,
            icon: tileset['checkmark.png'],
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                if (this.hasTileNumber) {
                    this.hasTileNumber = !this.hasTileNumber;
                    boardManager.setTilesNumberVisiblity(false);
                    this.tileNumberButton.icon.texture = tileset['cross.png'];
                } else {
                    this.hasTileNumber = !this.hasTileNumber;
                    boardManager.setTilesNumberVisiblity(true);
                    this.tileNumberButton.icon.texture = tileset['checkmark.png'];
                }
            }
        });
        this.tileNumberButton.position.set(200, 130);
        this.panel.body.addChild(this.tileNumberButton);
        
        this.closeBtn = new Button({
            text: 'CLOSE',
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
        this.closeBtn.position.set(
            this.panel.w -this.closeBtn.w - 20, 
            this.panel.h - this.closeBtn.h - 20);
        this.panel.body.addChild(this.closeBtn);

        text = new Text('SOUND: ', textStyle);
        text.position.set(20, 20);
        this.panel.body.addChild(text);

        text = new Text('MUSIC: ', textStyle);
        text.position.set(20, 80);
        this.panel.body.addChild(text);

        text = new Text('TILE NUMBER: ', textStyle);
        text.position.set(20, 140);
        this.panel.body.addChild(text);

        this.panel.putCenter();
        this.addChild(this.panel);
    }

    update(delta) {

    }
}