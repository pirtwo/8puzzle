import {
    Container
} from 'pixi.js';

export default class Scene extends Container {
    constructor() {
        super();
    }

    show() {
        this.visible = true;
        return this;
    }

    hide() {
        this.visible = false;
        return this;
    }

    update(delta) {
        throw Error('update function is not implmented.');
    }
}