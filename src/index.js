import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import Button from './scenes/button';
import BoardManager from "./board-manager";
import SplashScreen from './scenes/splash';
import LoadingScene from './scenes/loading';
import SettingScene from './scenes/settings';
import PuzzleScene from './scenes/puzzle';

const app = new PIXI.Application({
    autoStart: false,
    antialias: true,
    width: 768,
    height: 1024,
    backgroundColor: 0xffffff
});

const {
    Text,
    TextStyle,
    Graphics,
    Container
} = PIXI;

const textStyle = new TextStyle({
        fontFamily: 'Courier New',
        fontSize: 25,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: 0x3d3d3d
    }),
    btnTextStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 17,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: 0x3d3d3d
    });


let bm,
    menu,
    body,
    title,
    tools,
    installPrompt;

// tileset
let tileset;

// scenes
let spalshScreen,
    puzzleSelectScene,
    settingScene,
    loadingScene;

// sounds
let music,
    clickSound;

// buttons
let puzzleSelectButton,
    solveButton,
    shuffleButton,
    settingButton;



function init() {
    document.body.appendChild(app.view);
    scaleToWindow(app.view);

    // create splash screen
    spalshScreen = new SplashScreen({
        width: 768,
        height: 1024
    });
    app.stage.addChild(spalshScreen);

    // load game assets
    app.loader
        .add('click', './assets/sounds/click.ogg')
        .add('music', './assets/sounds/music.mp3')
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

    // update loading progress
    app.loader.on('progress', loader => {
        spalshScreen.progress.text = `loading ${loader.progress.toFixed(0)}% ...`;
    });
}

function setup(loader, resources) {
    app.stop();
    tileset = resources['tileset'].textures;
    music = resources.music.sound;
    clickSound = resources.click.sound;

    registerServiceWorker();

    // -- sections --
    title = new Container();
    menu = new Container();
    body = new Container();
    tools = new Container();

    body.w = 768;
    body.h = 1024;
    menu.w = 768;
    menu.h = 100;

    // add body bg
    let ctx = new Graphics();
    ctx.beginFill(0xf99d07, 0.85);
    ctx.drawRect(0, 0, body.w, body.h);
    ctx.endFill();
    body.addChild(ctx);

    // add menu bg
    ctx = new Graphics();
    ctx.beginFill(0xf99d07);
    ctx.drawRect(0, 0, menu.w, menu.h);
    ctx.endFill();
    menu.addChild(ctx);

    let titleText = new Text('8Puzzle', new TextStyle({
        fontFamily: 'Courier',
        fontSize: 60,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: ['#ffffff', '#f9e104'],
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 2
    }));
    title.addChild(titleText);
    title.position.set(20, 10);

    body.position.set(0, 0);
    menu.position.set(0, 0);
    // -- end --

    // -- assets --    
    bm = new BoardManager({
        rowNum: 3,
        colNum: 3,
        tileWidth: 240,
        tileMargin: 1,
        tileSpeed: 30,
        emptyTile: 9,
        tileClickCallback: onTileClicked,
        solveCallback: onPuzzleSolved,
        puzzleCompleteCallback: onPuzzleComplete
    });

    bm.createBoard()
        .createTiles()
        .createPins()
        .setBackground(resources['puzzle-01'].texture)
        .setPuzzleTexture(resources['puzzle-01'].texture)
        .shuffle()
        .setBoardPosition(body.width / 2 - bm.getWidth() / 2, menu.h + 40);

    loadingScene = new LoadingScene({
        text: 'solving puzzle ...',
        width: 400,
        height: 150
    });
    loadingScene.hide();

    settingScene = new SettingScene({
        width: 500,
        height: 450,
        boardManager: bm
    });
    settingScene.hide();

    puzzleSelectScene = new PuzzleScene({
        width: 600,
        height: 500,
        boardManager: bm
    });
    puzzleSelectScene.hide();

    puzzleSelectButton = new Button({
        icon: tileset['movie.png'],
        width: 70,
        height: 70,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onPuzzleSelectClicked
    });
    puzzleSelectButton.position.set(0, 0);

    shuffleButton = new Button({
        icon: tileset['return.png'],
        width: 70,
        height: 70,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onShuffleClicked
    });
    shuffleButton.position.set(80, 0);

    solveButton = new Button({
        icon: tileset['menuGrid.png'],
        width: 70,
        height: 70,
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onSolveClicked
    });
    solveButton.position.set(160, 0);

    settingButton = new Button({
        width: 70,
        height: 70,
        icon: tileset['gear.png'],
        clickSound: clickSound,
        idleTexture: tileset['yellow_button_idle.png'],
        hoverTexture: tileset['yellow_button_hover.png'],
        clickTexture: tileset['yellow_button_active.png'],
        clickCallback: onSettingClicked
    });
    settingButton.position.set(240, 0);
    // -- end --

    menu.addChild(title, tools);
    tools.addChild(puzzleSelectButton, shuffleButton, solveButton, settingButton);
    tools.position.set(menu.w - tools.width - 20, 20);
    body.addChild(menu, bm.board);

    app.stage.addChild(body, puzzleSelectScene, settingScene, loadingScene);

    music.volume = 0.1;
    music.loop = true;
    music.play();

    spalshScreen.ticker.destroy();
    spalshScreen.destroy();
    app.stage.removeChild(spalshScreen);

    app.ticker.add((delta) => {
        update(delta)
    });

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

/**
 * callback function for select puzzle button.
 * @param {Object} e 
 */
function onPuzzleSelectClicked(e) {
    if (bm.hasMoves()) return;
    puzzleSelectScene.show();
}

/**
 * callback function for solve button click event.
 * @param {object} e 
 */
function onSolveClicked(e) {
    if (bm.hasMoves()) return;
    bm.solve();
    loadingScene.show();
}

/**
 * callback function for shuffle button click event.
 * @param {object} e 
 */
function onShuffleClicked(e) {
    if (bm.hasMoves()) return;
    bm.hideBackground().reset().shuffle();
}

/**
 * callback function for setting button click event.
 * @param {object} e 
 */
function onSettingClicked(e) {
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
 * this function will be called when the puzzle
 * is solved by board manager. 
 */
function onPuzzleSolved() {
    loadingScene.hide();
}

/**
 * this function will be called when the puzzle
 * is complete.
 */
function onPuzzleComplete() {
    bm.showBackground();
}

function scaleToWindow(canvas, backgroundColor) {
    var scaleX, scaleY, scale, center;

    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / canvas.offsetWidth;
    scaleY = window.innerHeight / canvas.offsetHeight;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    canvas.style.transformOrigin = "0 0";
    canvas.style.transform = "scale(" + scale + ")";

    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
            center = "horizontally";
        } else {
            center = "vertically";
        }
    } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
            center = "vertically";
        } else {
            center = "horizontally";
        }
    }

    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + "px";
        canvas.style.marginBottom = 0 + "px";
        canvas.style.marginLeft = margin + "px";
        canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases) 
    if (center === "vertically") {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + "px";
        canvas.style.marginBottom = margin + "px";
        canvas.style.marginLeft = 0 + "px";
        canvas.style.marginRight = 0 + "px";
    }

    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    canvas.style.paddingLeft = 0 + "px";
    canvas.style.paddingRight = 0 + "px";
    canvas.style.paddingTop = 0 + "px";
    canvas.style.paddingBottom = 0 + "px";
    canvas.style.display = "block";

    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;

    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
        if (ua.indexOf("chrome") > -1) {
            // Chrome
        } else {
            // Safari
            //canvas.style.maxHeight = "100%";
            //canvas.style.minHeight = "100%";
        }
    }

    //5. Return the `scale` value. This is important, because you'll nee this value 
    //for correct hit testing between the pointer and sprites
    return scale;
}

/**
 * listen to window resize event
 */
window.addEventListener('resize', (e) => {
    scaleToWindow(app.view);
});

/**
 * catch PWA install prompt
 */
window.addEventListener('beforeinstallprompt', e => {
    console.log('catch install prompt');
    e.preventDefault();
    installPrompt = e;
});

/**
 * registers a service worker for PWA application.
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            console.log('SW registered');
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    } else {
        console.log('no service worker!!!');
    }
}

init();

export {
    app,
    textStyle,
    btnTextStyle,
    installPrompt
};