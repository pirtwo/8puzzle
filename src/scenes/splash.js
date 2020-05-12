import * as PIXI from 'pixi.js';
import * as Game from '../index';
import Scene from '../scene';

export default class SplashScreen extends Scene {
    constructor({
        width,
        height
    }) {
        super();

        let ctx = new PIXI.Graphics();

        this.rendrer = PIXI.autoDetectRenderer({
            width: width,
            height: height
        });
        this.ticker = new PIXI.Ticker();
        this.ticker.autoStart = false;
        this.ticker.add(() => {
            Game.app.render();
        });

        this.title = new PIXI.Text('8Puzzle', new PIXI.TextStyle({
            fontFamily: 'Courier',
            fontSize: 90,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: ['#ffffff', '#f9e104'],
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        }));
        this.title.anchor.set(0.5);
        this.title.position.set(width / 2, height / 2 - 80);

        this.progress = new PIXI.Text('loading 0% ...', new PIXI.TextStyle({
            fontFamily: 'Courier New',
            fontSize: 25,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 0xffffff
        }));
        this.progress.anchor.set(0.5);
        this.progress.position.set(width / 2, height / 2);

        ctx.beginFill(0xf99d07);
        this.background = ctx.drawRect(0, 0, width, height);
        ctx.endFill();

        this.addChild(this.background, this.title, this.progress);
        this.ticker.start();
    }
}