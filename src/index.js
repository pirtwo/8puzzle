import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import BoardManager from "./board-manager";

const app = new PIXI.Application({
    backgroundColor: 0x1099bb
});

const {
    Text,
    TextStyle,
    Graphics,
    Container,
    ParticleContainer,
    Point
} = PIXI;

let bm,
    move,
    src,
    des,
    srcPin,
    desPin,
    emptyTile,
    solveButton,
    shuffleButton,
    fps,
    timeElapsed = 0,
    lastFPSCheck = 0;

document.body.appendChild(app.view);
setup();

function setup(loader, resources) {
    bm = new BoardManager({
        rowNum: 3,
        colNum: 3,
        tileWidth: 90,
        tileMargin: 10,
        tileSpeed: 10
    });

    bm.setBoard(createBoard(bm))
        .setTiles(createTiles(bm, 9))
        .setEmptyTile(bm.tiles.find(t => t.isEmpty))
        .setPinPoints(createPinPoints(bm))
        .setBoardPosition(100, 100);
    emptyTile = bm.getEmptyTile();

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
    move = bm.getCurrentMove();

    if (move) {
        src = emptyTile;
        des = bm.tiles.find(t =>
            t.row == move.fn(src.row, src.col).row &&
            t.col == move.fn(src.row, src.col).col
        );

        srcPin = bm.getPin(des.row, des.col);
        desPin = bm.getPin(src.row, src.col);

        // update tiles positions
        src.position.x +=
            move.getVelocity(bm.tileSpeed).vx * delta;
        src.position.y +=
            move.getVelocity(bm.tileSpeed).vy * delta;
        des.position.x +=
            -move.getVelocity(bm.tileSpeed).vx * delta;
        des.position.y +=
            -move.getVelocity(bm.tileSpeed).vy * delta;

        if (
            (move.name == 'slideLeft' &&
                src.x <= srcPin.x) ||
            (move.name == 'slideRight' &&
                src.x >= srcPin.x) ||
            (move.name == 'slideUp' &&
                src.y <= srcPin.y) ||
            (move.name == 'slideDown' &&
                src.y >= srcPin.y)
        ) {
            src.vx = src.vy = 0;
            des.vx = des.vy = 0;
            src.position = srcPin;
            des.position = desPin;
            bm.swapTiles(src, des).removeCurrentMove();
        }
    }


}

function createBoard(bm) {
    let board = new Container(),
        graphics = new Graphics();

    // draw board body
    graphics.lineStyle(2, 0xc219a6);
    graphics.drawRect(0, 0, bm.getWidth(), bm.getHeight());

    // draw grid
    for (let i = 1; i < bm.rows; i++) {
        graphics.moveTo(0, i * bm.getCellWidth());
        graphics.lineTo(bm.getWidth(), i * bm.getCellWidth());
    }

    for (let j = 1; j < bm.cols; j++) {
        graphics.moveTo(j * bm.getCellWidth(), 0);
        graphics.lineTo(j * bm.getCellWidth(), bm.getHeight());
    }

    board.addChild(graphics);
    return board;
}

function createTiles(bm, ...emptyTiles) {
    let tile,
        tiles = [],
        tileNum = 1,
        tileText,
        graphic;

    const textStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: 'bold',
    });

    for (let row = 0; row < bm.rows; row++) {
        for (let col = 0; col < bm.cols; col++) {
            // set tile properties
            tile = new Container();
            tile.row = row;
            tile.col = col;
            tile.vx = 0;
            tile.vy = 0;
            tile.number = tileNum;
            tile.isEmpty = emptyTiles.indexOf(tileNum) > -1;
            tile.interactive = true;
            tile.on("pointerdown", onTileClicked);

            // add tile shape
            graphic = new Graphics();
            graphic.beginFill(0x0fdb91, tile.isEmpty ? 0.5 : 1);
            tile.addChild(graphic.drawRect(0, 0, bm.tileWidth, bm.tileWidth));
            graphic.endFill();

            // add tile text
            tileText = new Text(`Tile: ${tile.isEmpty ? 'EMPTY' : tileNum}`, textStyle);
            tileText.anchor.set(0.5);
            tileText.position.set(bm.tileWidth / 2, bm.tileWidth / 2);
            tile.addChild(tileText);

            tile.position.set(
                col * bm.getCellWidth() + bm.tileMargin,
                row * bm.getCellWidth() + bm.tileMargin,
            )

            tileNum++;
            tiles.push(tile);
        }
    }

    return tiles;
}

function createPinPoints(bm) {
    let pinPoints = [];

    for (let row = 0; row < bm.rows; row++) {
        for (let col = 0; col < bm.cols; col++) {
            pinPoints.push({
                row,
                col,
                pin: new Point(
                    col * bm.getCellWidth() + bm.tileMargin,
                    row * bm.getCellWidth() + bm.tileMargin
                )
            });
        }
    }

    return pinPoints;
}

function createButtons() {
    let ctx, text;

    ctx = new Graphics();
    solveButton = new Container();

    ctx.beginFill(0xc70ddb);
    ctx.drawRect(10, 10, 100, 50);
    ctx.endFill();
    text = new Text('Solve');

    solveButton.addChild(ctx);
    solveButton.addChild(text);
    text.anchor.set(0.5);
    text.position.set(50, 25);

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
        console.log(move);
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