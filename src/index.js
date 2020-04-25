import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import BoardManager from "./board-manager";

const app = new PIXI.Application({
    backgroundColor: 0x1099bb
});

const {
    Text,
    Graphics,
    Container
} = PIXI;

let bm,
    ctx,
    fps,
    solveButton,
    shuffleButton,
    timeElapsed = 0,
    lastFPSCheck = 0;

document.body.appendChild(app.view);
setup();

function setup(loader, resources) {
    ctx = new Graphics();

    bm = new BoardManager({
        rowNum: 3,
        colNum: 3,
        tileWidth: 90,
        tileMargin: 10,
        tileSpeed: 10
    });

    bm.createBoard()
        .createTiles(9, onTileClicked)
        .createPins()
        .setBoardPosition(100, 100);

    createButtons();

    fps = new Text("FPS: 00.00", {
        fontFamily: 'Arial',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: 'bold',
    });
    fps.position.set(700, 10);

    app.stage.addChild(bm.board, solveButton, fps);
}

function update(delta) {
    updateFPS();
    bm.update(delta);
}

function createButtons() {
    let ctx, text;

    ctx = new Graphics();
    solveButton = new Container();

    ctx.beginFill(0xc70ddb);
    ctx.drawRect(0, 0, 100, 50);
    ctx.endFill();
    text = new Text('Solve');

    solveButton.addChild(ctx);
    solveButton.addChild(text);
    text.anchor.set(0.5);
    text.position.set(50, 25);
    solveButton.position.set(400, 20);

    solveButton.interactive = true;
    solveButton.on('pointerdown', () => {
        bm.solve();
    })
}

function onTileClicked(e) {
    let tile = e.target,
        move = bm.canTileMove(tile);
    if (move) {
        bm.pushMove(move);
        bm.execute();
    }
}

function updateFPS() {
    timeElapsed += app.ticker.elapsedMS;
    if (timeElapsed > lastFPSCheck + 1000) {
        fps.text = `FPS: ${app.ticker.FPS.toFixed(2)}`;
        lastFPSCheck = timeElapsed;
    }
}

app.ticker.add((delta) => {
    update(delta)
});