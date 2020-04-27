import Scene from '../scene';
import {
    Graphics
} from 'pixi.js';

export default class Spinner extends Scene {
    constructor() {
        super();

        let ctx = new Graphics();
        // ctx.lineStyle(2, 0x000000);
        ctx.beginFill(0x000000);
        this.parentCircle = ctx.drawCircle(0, 0, 15);
        ctx.position.set(0, 0);
        this.addChild(ctx);

        ctx = new Graphics();
        ctx.beginFill(0xffffff);
        this.childCircle = ctx.drawCircle(0, 0, 5);
        this.childCircle.pivot.set(7, 0);
        ctx.position.set(0, 0);
        this.addChild(ctx);

        this.childCircle.rotation = 20;
    }

    update(delta) {
        this.childCircle.rotation += 0.1 * delta;
    }
}