import * as utils from './utils';
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
    }

    getDepth() {
        return this.parent ? this.parent.getDepth() + 1 : 0;
    }

    getEmptyTile() {
        return this.state.indexOf('9');
    }

    getSuccessors() {
        let src, des, child,
            empty,
            successors = [];

        empty = utils.indexToCoordinate(this.getEmptyTile());

        Object.keys(ACTIONS).forEach(key => {
            child = this.clone();
            child.parent = this;
            child.operation = ACTIONS[key];
            src = child.state[utils.coordinateToIndex(empty)];
            des = child.state[utils.coordinateToIndex(ACTIONS[key].fn(empty.row, empty.col))];

            if (src && des) {
                child.state =
                   utils.swapChars(child.state, src, des);
                successors.push(child);
            }
        });

        return successors;
    }

    clone() {
        return new TreeNode({
            state: this.state,
            parent: this.parent,
            operation: this.operation,
        });
    }
}