import Scene from '../scene';
import Panel from './panel';
import Button from './button';
import {
    app,
    textStyle,
    btnTextStyle,
    installPrompt
} from '../index';
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
        let text,
            storage = localStorage,
            gameMusic = app.loader.resources.music.sound,
            uiSound = app.loader.resources.click.sound,
            tileset = app.loader.resources['tileset'].textures;

        this.panel = new Panel({
            width: width,
            height: height,
            backdropWidth: app.view.width,
            backdropHeight: app.view.height
        });

        // -- load settings --
        uiSound.muted = !storage.getItem('hasUISound') ||
            storage.getItem('hasUISound') == 'false' ?
            true : false;
        gameMusic.muted = !storage.getItem('hasMusic') ||
            storage.getItem('hasMusic') == 'false' ?
            true : false;
        this.hasTileNumber = !storage.getItem('hasTileNumber') ||
            storage.getItem('hasTileNumber') == 'true' ?
            true : false;
        boardManager.setTilesNumberVisiblity(this.hasTileNumber);

        // sound settings
        this.soundButton = new Button({
            width: 50,
            height: 50,
            icon: uiSound.muted ? tileset['audioOff.png'] : tileset['audioOn.png'],
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
                storage.setItem('hasUISound', !uiSound.muted);
            }
        });
        this.soundButton.position.set(400, 30);
        this.panel.body.addChild(this.soundButton);

        // music settings
        this.musicButton = new Button({
            width: 50,
            height: 50,
            icon: gameMusic.muted ? tileset['musicOff.png'] : tileset['musicOn.png'],
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
                storage.setItem('hasMusic', !gameMusic.muted);
            }
        });
        this.musicButton.position.set(400, 90);
        this.panel.body.addChild(this.musicButton);

        // board settings
        this.tileNumberButton = new Button({
            width: 50,
            height: 50,
            icon: this.hasTileNumber ? tileset['checkmark.png'] : tileset['cross.png'],
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
                storage.setItem('hasTileNumber', this.hasTileNumber);
            }
        });
        this.tileNumberButton.position.set(400, 150);
        this.panel.body.addChild(this.tileNumberButton);

        // share button
        this.shareButton = new Button({
            width: 50,
            height: 50,
            icon: tileset['share2.png'],
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                let body = document.querySelector('body');
                let tmpElm = document.createElement('textarea');
                tmpElm.value = 'my game link';
                body.appendChild(tmpElm);
                tmpElm.select();
                tmpElm.setSelectionRange(0, 99999);
                document.execCommand('copy');
                tmpElm.remove();
            }
        });
        this.shareButton.position.set(400, 210);
        this.panel.body.addChild(this.shareButton);

        // PWA install button
        this.installButton = new Button({
            width: 50,
            height: 50,
            icon: tileset['import.png'],
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                if (installPrompt) {
                    installPrompt.prompt();
                    installPrompt.userChoice.then(choice => {
                        if (choice.outcome === 'accepted') {
                            this.installText.visible = false;
                            this.installButton.visible = false;
                        }
                    });
                }
            }
        });
        this.installButton.position.set(400, 270);
        this.panel.body.addChild(this.installButton);
        this.installButton.visible = false;

        this.closeBtn = new Button({
            text: 'CLOSE',
            width: 100,
            height: 50,
            textStyle: btnTextStyle,
            idleTexture: tileset['yellow_button_idle.png'],
            hoverTexture: tileset['yellow_button_hover.png'],
            clickTexture: tileset['yellow_button_active.png'],
            clickSound: app.loader.resources.click.sound,
            clickCallback: () => {
                this.hide();
            }
        });
        this.closeBtn.position.set(
            this.panel.w - this.closeBtn.w - 20,
            this.panel.h - this.closeBtn.h - 20);
        this.panel.body.addChild(this.closeBtn);

        text = new Text('SOUND', textStyle);
        text.position.set(30, 40);
        this.panel.body.addChild(text);

        text = new Text('MUSIC', textStyle);
        text.position.set(30, 100);
        this.panel.body.addChild(text);

        text = new Text('TILE NUMBER', textStyle);
        text.position.set(30, 160);
        this.panel.body.addChild(text);

        text = new Text('SHARE :)', textStyle);
        text.position.set(30, 220);
        this.panel.body.addChild(text);

        this.installText = new Text('INSTALL ON BROWSER', textStyle);
        this.installText.position.set(30, 280);
        this.installText.visible = false;
        this.panel.body.addChild(this.installText);

        if (installPrompt) {
            this.installText.visible = true;
            this.installButton.visible = true;
        }

        this.panel.putCenter();
        this.addChild(this.panel);
    }
}