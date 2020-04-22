import * as utils from './utils';

export default function calcManhattanDistance(node) {
    let totalDist = 0;
    let curPos, origin,
        tile, tiles = node.state.split('').filter(tile => +tile !== 9);

    for (let i = 0; i < tiles.length; i++) {
        tile = tiles[i];
        curPos = utils.indexToCoordinate(node.state.indexOf(tile));
        origin = utils.indexToCoordinate(tile - 1);
        totalDist += Math.abs(curPos.row - origin.row) + Math.abs(curPos.col - origin.col);
    }
    
    return totalDist;
}