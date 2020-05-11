import Scene from '../scene';
import Panel from './panel';
import Spinner from './spinner';
import {
    app,
    textStyle
} from '../index';
import {
    Text
} from 'pixi.js';

export default class LoadingScene extends Scene {
    constructor({
        text,
        width,
        height
    }) {
        super();

        this.spinner = new Spinner({
            radius: 20,
            spinnerRadius: 7,
            speed: 20
        });
        this.panel = new Panel({
            width: width,
            height: height,
            backdropWidth: app.view.width,
            backdropHeight: app.view.height
        });

        this.text = new Text(text, textStyle);
        this.text.anchor.set(0.5);

        this.panel.body.addChild(this.text);
        this.panel.body.addChild(this.spinner);

        this.panel.putCenter();
        this.text.position.set(this.panel.w / 2 + 20, this.panel.h / 2);
        this.spinner.position.set(50, this.panel.h / 2);
        this.addChild(this.panel);
    }

    update(delta) {
        this.spinner.update(delta);
    }
}