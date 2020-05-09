import Scene from '../scene';
import {
    Graphics
} from 'pixi.js';

export default class Spinner extends Scene {
    constructor({
        radius = 25,
        spinnerRadius = 10,
        speed = 20
    }) {
        super();

        let ctx = new Graphics();
        ctx.beginFill(0x000000);
        this.parentCircle = ctx.drawCircle(0, 0, radius);
        ctx.position.set(0, 0);
        this.addChild(ctx);

        ctx = new Graphics();
        ctx.beginFill(0xffffff);
        this.childCircle = ctx.drawCircle(0, 0, spinnerRadius);
        this.childCircle.pivot.set(spinnerRadius + 3, 0);
        ctx.position.set(0, 0);
        this.addChild(ctx);

        this.childCircle.rotation = speed;
    }

    update(delta) {
        this.childCircle.rotation += 0.1 * delta;
    }
}