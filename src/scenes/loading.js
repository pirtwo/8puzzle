import Scene from '../scene';
import Panel from './panel';
import Spinner from './spinner';
import {
    Text,
    TextStyle
} from 'pixi.js';

export default class LoadingScene extends Scene {
    constructor({
        text,
        width,
        height
    }) {
        super();

        this.spinner = new Spinner();
        this.panel = new Panel({
            width: 280,
            height: 70,
            backdropWidth: width,
            backdropHeight: height
        })

        let textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: 'bold',
            wordWrap: true,
            wordWrapWidth: this.panel.width / 2,
            align: 'center'
        });

        this.text = new Text(text, textStyle);
        this.text.anchor.set(0.5);

        this.panel.body.addChild(this.text);
        this.panel.body.addChild(this.spinner);

        this.panel.putCenter();
        this.text.position.set(this.panel.w / 2, this.panel.h / 2);
        this.spinner.position.set(30, this.panel.h / 2);
        this.addChild(this.panel);
    }

    update(delta) {
        this.spinner.update(delta);
    }
}