export default function goalTest(node) {
    let flag = true;
    node.state.forEach(tile => {
        if (tile.number != (tile.row * tile.totalCols + tile.col + 1)) flag = false;
    });
    return flag;
}