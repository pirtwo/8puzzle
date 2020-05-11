import * as PIXI from 'pixi.js';
import * as Game from '../index';
import Scene from '../scene';

export default class SplashScreen extends Scene {
    constructor({
        text,
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

        this.text = new PIXI.Text(text, new PIXI.TextStyle({
            fontFamily: 'Courier New',
            fontSize: 25,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 0xffffff
        }));
        this.text.anchor.set(0.5);
        this.text.position.set(width / 2, height / 2);

        ctx.beginFill(0x000000);
        this.background = ctx.drawRect(0, 0, width, height);
        ctx.endFill();

        this.addChild(this.background, this.text);
        this.ticker.start();
    }
}