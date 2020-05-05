import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import Button from './scenes/button';
import BoardManager from "./board-manager";
import LoadingScene from './scenes/loading';
import SettingScene from './scenes/settings';
import PuzzleScene from './scenes/puzzle';

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
let puzzleSelectScene, settingScene, loadingScene;

// sounds
let clickSound;

// buttons
let puzzleSelectButton, solveButton, shuffleButton, settingButton;

document.body.appendChild(app.view);

app.loader
    .add('click', './assets/sounds/click1.ogg')
    .add('tileset', './assets/sprites/tileset.json')
    .add('puzzle-01', './assets/images/puzzle-01.jpg')
    .add('puzzle-02', './assets/images/puzzle-02.jpg')
    .add('puzzle-03', './assets/images/puzzle-03.jpg')
    .add('puzzle-04', './assets/images/puzzle-04.jpg')
    .add('puzzle-05', './assets/images/puzzle-05.jpg')
    .add('puzzle-06', './assets/images/puzzle-06.jpg')
    .add('puzzle-07', './assets/images/puzzle-07.jpg')
    .add('puzzle-08', './assets/images/puzzle-08.jpg')
    .add('puzzle-09', './assets/images/puzzle-09.jpg')
    .add('puzzle-10', './assets/images/puzzle-10.jpg')
    .load(setup);

function setup(loader, resources) {
    app.stop();
    tileset = resources['tileset'].textures;
    clickSound = resources.click.sound;

    let img = resources['puzzle-01'].texture;

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

    puzzleSelectScene = new PuzzleScene({
        width: app.screen.width,
        height: app.screen.height,
        boardManager: bm
    });
    puzzleSelectScene.hide();

    puzzleSelectButton = new Button({
        icon: tileset['movie.png'],
        width: 60,
        height: 60,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onPuzzleSelectClicked
    });
    puzzleSelectButton.position.set(0, 0);

    shuffleButton = new Button({
        icon: tileset['return.png'],
        width: 60,
        height: 60,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onShuffleClicked
    });
    shuffleButton.position.set(70, 0);

    solveButton = new Button({
        icon: tileset['menuGrid.png'],
        width: 60,
        height: 60,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onSolveClicked
    });
    solveButton.position.set(140, 0);

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
    settingButton.position.set(210, 0);
    // -- end --

    head.addChild(title, tools);
    body.addChild(bm.board);
    tools.addChild(puzzleSelectButton, shuffleButton, solveButton, settingButton);
    tools.position.set(head.w - tools.width - 20, 20);

    app.stage.addChild(head, body, puzzleSelectScene, settingScene, loadingScene);
    app.start();
}

/**
 * updates game logic.
 * @param {number} delta 
 */
function update(delta) {
    bm.update(delta);
    loadingScene.update(delta);
}

function onPuzzleSelectClicked(e) {
    console.log('select clicked!!!');
    puzzleSelectScene.show();
}

/**
 * callback function for solve button click event.
 * @param {object} e 
 */
function onSolveClicked(e) {
    console.log('solve clicked!!!')
    bm.solve();
    loadingScene.show();
}

/**
 * callback function for shuffle button click event.
 * @param {object} e 
 */
function onShuffleClicked(e) {
    console.log('shuffle clicked!!!')
    bm.reset();
    bm.shuffle();
}

/**
 * callback function for setting button click event.
 * @param {object} e 
 */
function onSettingClicked(e) {
    console.log('setting clicked!!!')
    settingScene.show();
}

/**
 * handel the click on the tile.
 * @param {object} e 
 */
function onTileClicked(e) {
    let tile = e.target,
        move = bm.canTileMove(tile);
    if (move) {
        bm.pushMove(move);
        bm.execute();
    }
}

/**
 * this function will be called when puzzle
 * solved by board manager. 
 */
function onPuzzleSolved() {
    loadingScene.hide();
}

/**
 * registers a service worker for PWA application.
 */
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