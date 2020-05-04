import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import Button from './scenes/button';
import BoardManager from "./board-manager";
import LoadingScene from './scenes/loading';
import SettingScene from './scenes/settings';

const app = new PIXI.Application({
    autoStart: false,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff
});

const {
    Text,
    TextStyle,
    Graphics,
    Container
} = PIXI;

const ScreenCenter = {
    x: app.screen.width / 2,
    y: app.screen.height / 2
}

let bm,
    head,
    body,
    title,
    tools;

// tileset
let tileset;

// scenes
let settingScene, loadingScene;

// sounds
let clickSound;

// buttons
let solveButton, shuffleButton, settingButton;

document.body.appendChild(app.view);

app.loader
    .add('click', './assets/sounds/click1.ogg')
    .add('tileset', './assets/sprites/tileset.json')
    .add('bg-01', './assets/images/view-01.jpg')
    .load(setup);

function setup(loader, resources) {
    app.stop();
    tileset = resources['tileset'].textures;
    clickSound = resources.click.sound;

    let img = resources['bg-01'].texture;

    registerServiceWorker();

    // -- sections --
    title = new Container();
    head = new Container();
    body = new Container();
    tools = new Container();

    head.paddingTop = 5;
    head.paddingBot = 0;
    body.paddingTop = 0;
    body.paddingBot = 5;

    head.w = Math.floor(app.screen.width / 2) + 40;
    head.h = 100;
    body.w = Math.floor(app.screen.width / 2) + 40;
    body.h = app.screen.height - head.h -
        (head.paddingTop + head.paddingBot + body.paddingTop + body.paddingBot);

    let ctx = new Graphics();
    ctx.beginFill(0xf99d07);
    ctx.drawRect(0, 0, head.w, head.h);
    ctx.endFill();
    head.addChild(ctx);

    ctx = new Graphics();
    ctx.beginFill(0xf99d07, 0.85);
    ctx.drawRect(0, 0, body.w, body.h);
    ctx.endFill();
    body.addChild(ctx);

    let titleStyle = new TextStyle({
        fontFamily: 'Courier',
        fontSize: 40,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: ['#ffffff', '#f9e104'],
        stroke: '#4a1850',
        strokeThickness: 5,
    });
    let titleText = new Text('8Puzzle', titleStyle);
    title.addChild(titleText);
    title.position.set(20, 20);

    head.position.set(ScreenCenter.x - head.width / 2, head.paddingTop);
    body.position.set(ScreenCenter.x - head.width / 2,
        head.height + head.paddingTop + head.paddingBot + body.paddingTop);
    // -- end --

    // -- assets --    
    bm = new BoardManager({
        rowNum: 3,
        colNum: 3,
        tileWidth: Math.floor(body.width / 4),
        tileMargin: 1,
        tileSpeed: 15,
        emptyTile: 9,
        tileClickCallback: onTileClicked,
        solveCallback: onPuzzleSolved
    });

    bm.createBoard()
        .setBackground(img)
        .setPuzzleTexture(img)
        .createTiles()
        .createPins()
        .setBoardPosition(
            body.width / 2 - bm.getWidth() / 2,
            body.height / 2 - bm.getWidth() / 2);

    loadingScene = new LoadingScene({
        text: 'solving puzzle ...',
        width: app.screen.width,
        height: app.screen.height
    });
    loadingScene.hide();

    settingScene = new SettingScene({
        width: app.screen.width,
        height: app.screen.height,
        boardManager: bm
    });
    settingScene.hide();

    shuffleButton = new Button({
        text: 'Shuffle',
        width: 100,
        height: 60,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onShuffleClicked
    });
    shuffleButton.position.set(0, 0);

    solveButton = new Button({
        text: 'Solve',
        width: 100,
        height: 60,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onSolveClicked
    });
    solveButton.position.set(110, 0);

    settingButton = new Button({
        width: 60,
        height: 60,
        icon: tileset['gear.png'],
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onSettingClicked
    });
    settingButton.position.set(220, 0);
    // -- end --

    head.addChild(title, tools);
    body.addChild(bm.board);
    tools.addChild(shuffleButton, solveButton, settingButton);
    tools.position.set(head.w - tools.width - 20, 20);

    app.stage.addChild(head, body, settingScene, loadingScene);
    app.start();
}

function update(delta) {
    bm.update(delta);
    loadingScene.update(delta);
}

function onSolveClicked(e) {
    console.log('solve clicked!!!')
    bm.solve();
    loadingScene.show();
}

function onShuffleClicked(e) {
    console.log('shuffle clicked!!!')
    bm.reset();
    bm.shuffle();
}

function onSettingClicked(e) {
    console.log('setting clicked!!!')
    settingScene.show();
}

function onTileClicked(e) {
    let tile = e.target,
        move = bm.canTileMove(tile);
    if (move) {
        bm.pushMove(move);
        bm.execute();
    }
}

function onPuzzleSolved() {
    loadingScene.hide();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    } else {
        console.log('no service worker!!!');
    }
}

app.ticker.add((delta) => {
    update(delta)
});

export default app;