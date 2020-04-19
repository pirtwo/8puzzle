export default function calcManhattanDistance(node) {
    let totalDist = 0;
    node.state.filter(t => !t.isEmpty).forEach(tile => {
        let origin = getOrigin(tile);
        totalDist += Math.abs(tile.row - origin.row) + Math.abs(tile.col - origin.col);
    });
    return totalDist;
}

function getOrigin(tile) {
    let row = Math.floor((tile.number - 1) / tile.totalRows);
    let col = tile.number - row * tile.totalCols - 1;
    return {
        row,
        col
    }
}