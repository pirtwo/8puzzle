import {
    Point,
    Text,
    TextStyle,
    Container,
    Graphics,
    Sprite,
    Rectangle,
    Texture
} from 'pixi.js';
import * as utils from './utils';
import * as math from '../lib/math';
import ACTIONS from './operations';

export default class BoardManager {
    constructor({
        rows = 3,
        cols = 3,
        cellWidth,
        tileWidth,
        emptyTile,
        tileMargin = 5,
        tileSpeed = 10,
        solveCallback,
        tileClickCallback
    }) {
        this._srcTile;
        this._desTile;
        this._srcPin;
        this._desPin;
        this._currMove;
        this.rows = rows;
        this.cols = cols;
        this.tiles = [];
        this.pins = [];
        this.texture = undefined;
        this.board = new Container();
        this.background = new Sprite();
        this.cellWidth = cellWidth;
        this.tileWidth = tileWidth;
        this.tileMargin = tileMargin;
        this.tileSpeed = tileSpeed;
        this.exectionQueue = [];
        this.solveCallback = solveCallback;
        this.tileClickCallback = tileClickCallback;
        this.emptyTileNumber = emptyTile;

        this.board.addChild(this.background);

        this.worker = new Worker('./js/worker.js');
        this.worker.onmessage = (msg) => {
            if (msg.data instanceof Array) {
                for (const action of msg.data) {
                    this.exectionQueue.push(ACTIONS[action]);
                }
                this.execute();
                solveCallback();
            }
        }
    }

    getWidth() {
        return this.rows * this.getCellWidth();
    }

    getHeight() {
        return this.cols * this.getCellWidth();
    }

    getCellWidth() {
        return this.tileWidth + this.tileMargin * 2;
    }

    getEmptyTile() {
        return this.tiles.find(t => t.isEmpty);
    }

    getPin(row, col) {
        return this.pins.find(p => p.row == row && p.col == col).pin;
    }

    setBackground(texture) {
        this.background.texture = texture;
        this.background.tint = 0x5c5c5c;
        this.background.width = this.background.height = this.getWidth();
        return this;
    }

    setPuzzleTexture(texture) {
        this.texture = texture;
        return this;
    }

    setBoardPosition(x, y) {
        this.board.position.set(x, y);
        return this;
    }

    canTileMove(tile) {
        let emptyTile = this.getEmptyTile();
        if (tile === emptyTile) return false;
        if (this.isTopNeighbor(emptyTile, tile))
            return ACTIONS.slideDown;
        if (this.isBottomNeighbor(emptyTile, tile))
            return ACTIONS.slideUp;
        if (this.isLeftNeighbor(emptyTile, tile))
            return ACTIONS.slideRight;
        if (this.isRightNeighbor(emptyTile, tile))
            return ACTIONS.slideLeft;
        return false;
    }

    /**
     * return true if tileA is a top neighbor of tileB.
     * 
     * @param {object} tileA 
     * @param {object} tileB 
     */
    isTopNeighbor(tileA, tileB) {
        return tileA.col == tileB.col && tileA.row + 1 == tileB.row;
    }

    /**
     * return true if tileA is a bottom neighbor of tileB.
     * 
     * @param {object} tileA 
     * @param {object} tileB 
     */
    isBottomNeighbor(tileA, tileB) {
        return tileA.col == tileB.col && tileA.row - 1 == tileB.row;
    }

    /**
     * return true if tileA is a left neighbor of tileB.
     * 
     * @param {object} tileA 
     * @param {object} tileB 
     */
    isLeftNeighbor(tileA, tileB) {
        return tileA.row == tileB.row && tileA.col + 1 == tileB.col;
    }

    /**
     * return true if tileA is a right neighbor of tileB.
     * 
     * @param {object} tileA 
     * @param {object} tileB 
     */
    isRightNeighbor(tileA, tileB) {
        return tileA.row == tileB.row && tileA.col - 1 == tileB.col;
    }

    pushMove(move) {
        this.exectionQueue.push(move);
        return this;
    }

    /**
     * swaps row and col number of tileA with tileB.
     * 
     * @param {object} tileA 
     * @param {object} tileB 
     */
    swapTiles(tileA, tileB) {
        [tileA.row, tileB.row] = [tileB.row, tileA.row];
        [tileA.col, tileB.col] = [tileB.col, tileA.col];

        return this;
    }

    createBoard() {
        let ctx = new Graphics();

        // draw board body
        ctx.lineStyle(1, 0x000000, 0.1);
        ctx.drawRect(0, 0, this.getWidth(), this.getHeight());

        // draw grid
        // for (let i = 1; i < this.rows; i++) {
        //     ctx.moveTo(0, i * this.getCellWidth());
        //     ctx.lineTo(this.getWidth(), i * this.getCellWidth());
        // }

        // for (let j = 1; j < this.cols; j++) {
        //     ctx.moveTo(j * this.getCellWidth(), 0);
        //     ctx.lineTo(j * this.getCellWidth(), this.getHeight());
        // }

        this.board.addChild(ctx);

        return this;
    }

    createTiles() {
        let ctx,
            tile,
            tileNum = 1,
            tileText;

        let textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: this.getWidth() / 30,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fill: 0x000000
        });

        let frameWidth = Math.floor(this.texture.width / this.cols)

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // set tile properties
                tile = new Container();
                tile.row = row;
                tile.col = col;
                tile.vx = 0;
                tile.vy = 0;
                tile.number = tileNum;
                tile.isEmpty = tileNum == this.emptyTileNumber;
                tile.interactive = true;
                tile.on("pointerdown", this.tileClickCallback);

                if (tile.isEmpty) {
                    ctx = new Graphics();
                    ctx.beginFill(0x37b6f6, 0);
                    tile.addChild(ctx.drawRect(0, 0, this.tileWidth, this.tileWidth));
                    ctx.endFill();
                } else {
                    let frame = new Rectangle(
                        col * frameWidth,
                        row * frameWidth,
                        frameWidth,
                        frameWidth);
                    let sp = new Sprite(new Texture(this.texture, frame));
                    sp.width = sp.height = this.tileWidth;
                    tile.addChild(sp);
                }

                // add tile text
                ctx = new Graphics();
                let tileText = new Container();
                tileText.visible = !tile.isEmpty;
                let text = new Text(`${tileNum}`, textStyle);
                ctx.beginFill(0xffffff, 0.9);
                let textBg = ctx.drawRect(0, 0, 50, 50);
                text.anchor.set(0.5);
                text.position.set(textBg.width / 2, textBg.height / 2);
                tileText.addChild(textBg, text);
                tile.addChild(tileText);

                tile.position.set(
                    col * this.getCellWidth() + this.tileMargin,
                    row * this.getCellWidth() + this.tileMargin,
                )

                tileNum++;
                this.tiles.push(tile);
                this.board.addChild(tile);
            }
        }
        return this;
    }

    createPins() {
        this.pins = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.pins.push({
                    row,
                    col,
                    pin: new Point(
                        col * this.getCellWidth() + this.tileMargin,
                        row * this.getCellWidth() + this.tileMargin
                    )
                });
            }
        }

        return this;
    }

    setTilesVisiblity(isVisible) {
        for (const tile of this.tiles) {
            tile.visible = isVisible;
        }

        return this;
    }

    setTilesNumberVisiblity(isVisible) {
        for (const tile of this.tiles.filter(t => !t.isEmpty)) {
            tile.children[1].visible = isVisible;
        }

        return this;
    }

    shuffle() {
        let inversion = 20; // must be even number
        let arr = new Array(this.rows * this.cols)
            .fill(0)
            .map((v, i) => i + 1);
        let free = new Array(this.rows * this.cols)
            .fill(0)
            .map((v, i) => i);
        let blocked = [];

        for (let i = 0; i < inversion; i++) {
            free = free.sort((a, b) => a - b);
            let idx = free[math.randInt(0, free.length - 3)];
            free.splice(free.indexOf(idx), 1);
            blocked.push(idx);
            [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];

            for (const blockedIdx of blocked) {
                if (arr[blockedIdx] < arr[blockedIdx + 1]) {
                    free.push(blockedIdx);
                    blocked.splice(blocked.indexOf(blockedIdx), 1);
                }
            }
        }

        for (let i = 0; i < arr.length; i++) {
            let number = arr[i];
            let cord = utils.indexToCoordinate(i);
            let tile = this.tiles.find(t => t.number == number);
            tile.row = cord.row;
            tile.col = cord.col;
            tile.position = this.getPin(cord.row, cord.col);
        }

        console.log(arr);
        console.log(this.tiles.map(t => {
            return {
                row: t.row,
                col: t.col,
                num: t.number
            }
        }));
    }

    solve() {
        let currState = new Array(this.tiles.length);
        this.tiles.forEach(t => {
            currState[t.row * this.cols + t.col] = t.number;
        });
        this.worker.postMessage({
            start: true,
            state: currState.reduce((pre, cur) => `${pre}${cur}`)
        });
    }

    reset() {
        let index, tile;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                index = utils.coordinateToIndex({
                    row: i,
                    col: j
                });
                tile = this.tiles.find(t => t.number - 1 == index);
                tile.row = i;
                tile.col = j;
                tile.position = this.getPin(i, j);
            }
        }
    }

    execute() {
        if (this.exectionQueue.length > 0) {
            this._currMove = this.exectionQueue.shift();

            this._srcTile = this.getEmptyTile();
            this._desTile = this.tiles.find(t =>
                t.row == this._currMove.fn(this._srcTile.row, this._srcTile.col).row &&
                t.col == this._currMove.fn(this._srcTile.row, this._srcTile.col).col
            );

            this._srcPin = this.getPin(this._desTile.row, this._desTile.col);
            this._desPin = this.getPin(this._srcTile.row, this._srcTile.col);
        } else this._currMove = null;
        return this;
    }

    update(delta) {
        if (this._currMove) {
            this._srcTile.position.x +=
                this._currMove.getVelocity(this.tileSpeed).vx * delta;
            this._srcTile.position.y +=
                this._currMove.getVelocity(this.tileSpeed).vy * delta;
            this._desTile.position.x +=
                -this._currMove.getVelocity(this.tileSpeed).vx * delta;
            this._desTile.position.y +=
                -this._currMove.getVelocity(this.tileSpeed).vy * delta;

            if (
                (this._currMove.name == 'slideLeft' &&
                    this._srcTile.x <= this._srcPin.x) ||
                (this._currMove.name == 'slideRight' &&
                    this._srcTile.x >= this._srcPin.x) ||
                (this._currMove.name == 'slideUp' &&
                    this._srcTile.y <= this._srcPin.y) ||
                (this._currMove.name == 'slideDown' &&
                    this._srcTile.y >= this._srcPin.y)
            ) {
                this._srcTile.vx = this._srcTile.vy = 0;
                this._desTile.vx = this._desTile.vy = 0;
                this._srcTile.position = this._srcPin;
                this._desTile.position = this._desPin;
                this.swapTiles(this._srcTile, this._desTile).execute();
            }
        }
    }
}