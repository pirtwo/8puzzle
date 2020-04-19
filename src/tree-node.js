import ACTIONS from './operations';

export default class TreeNode {
    constructor({
        state,
        cost = 0,
        parent = null,
        operation = null
    }) {
        this.state = state;
        this.cost = cost;
        this.parent = parent;
        this.operation = operation;
        this.fingerprint = this.generateFingerprint();
    }

    static swapRowCol(tileA, tileB) {
        [tileA.row, tileB.row] = [tileB.row, tileA.row];
        [tileA.col, tileB.col] = [tileB.col, tileA.col];
    }

    getSuccessors() {
        let child, successors = [],
            {
                row,
                col
            } = this.getEmptyTile();

        Object.keys(ACTIONS).forEach(key => {
            child = this.clone();
            child.parent = this;
            child.operation = ACTIONS[key];

            let des = ACTIONS[key].fn(row, col);
            let tileA = child.state.find(n => n.row == row && n.col == col);
            let tileB = child.state.find(n => n.row == des.row && n.col == des.col);
            if (tileA && tileB) {
                TreeNode.swapRowCol(tileA, tileB);
                child.fingerprint = child.generateFingerprint();
                successors.push(child);
            }
        });

        return successors;
    }

    getEmptyTile() {
        return this.state.find(t => t.isEmpty);
    }

    getDepth() {
        return this.parent ? this.parent.getDepth() + 1 : 0;
    }

    generateFingerprint() {
        let currIdx, fingerprint = new Array(this.state.length);
        this.state.forEach(tile => {
            currIdx = tile.row * tile.totalCols + tile.col;
            fingerprint[currIdx] = tile.number;
        })

        return fingerprint.reduce((pre, cur)=> `${pre}${cur}`);
    }

    clone() {
        return new TreeNode({
            state: JSON.parse(JSON.stringify(this.state)),
            parent: this.parent,
            operation: this.operation,
        });
    }
}