import ACTIONS from './operations';

export default class BoardManager {
    constructor({
        rows = 3,
        cols = 3,
        cellWidth,
        tileWidth,
        tileMargin = 5,
        tileSpeed = 10
    }) {
        this.rows = rows;
        this.cols = cols;
        this.tiles = [];
        this.pinPoints = [];
        this.board = undefined;
        this.cellWidth = cellWidth;
        this.tileWidth = tileWidth;
        this.tileMargin = tileMargin;
        this.tileSpeed = tileSpeed;
        this.emptyTile = undefined;
        this.exectionQueue = [];

        this.worker = new Worker('./js/worker.js');
        this.worker.onmessage = (msg) => {
            if (msg.data instanceof Array) {
                for (const action of msg.data) {
                    this.exectionQueue.push(ACTIONS[action]);
                }
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
        return this.emptyTile;
    }

    getPin(row, col) {
        return this.pinPoints.find(p => p.row == row && p.col == col).pin;
    }

    getCurrentMove() {
        return this.exectionQueue[0];
    }

    getWorker() {
        return this.worker;
    }

    setBoard(board) {
        this.board = board;
        return this;
    }

    setTiles(tiles) {
        this.tiles = tiles;
        if (this.board) this.board.addChild(...tiles);
        return this;
    }

    setEmptyTile(tile) {
        this.emptyTile = tile;
        return this;
    }

    setBoardPosition(x, y) {
        this.board.position.set(x, y);
        return this;
    }

    setPinPoints(pinPoints) {
        this.pinPoints = pinPoints;
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

    removeCurrentMove() {
        this.exectionQueue.shift();
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

    shuffle() {
        // TODO: write a shuffle function to mix the tiles.
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
        // TODO: write a reset function to reset the tiles position.
    }
}