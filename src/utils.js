export function indexToCoordinate(index) {
    let row = Math.floor(index / 3),
        col = index - row * 3;
    return {
        row,
        col
    };
}

export function coordinateToIndex({
    row,
    col
}) {
    if (row < 0 || row > 2 || col < 0 || col > 2) return null;
    return row * 3 + col;
}

export function swapChars(str, charA, charB) {
    let indexA = str.indexOf(charA),
        indexB = str.indexOf(charB);

    if (indexA > indexB)[indexA, indexB] = [indexB, indexA];

    return str.substring(0, indexA) +
        str[indexB] +
        str.substring(indexA + 1, indexB) +
        str[indexA] +
        str.substring(indexB + 1)
}

/**
 * return true if tileA is a top neighbor of tileB.
 * 
 * @param {object} tileA 
 * @param {object} tileB 
 */
export function isTopNeighbor(tileA, tileB) {
    return tileA.col == tileB.col && tileA.row + 1 == tileB.row;
}

/**
 * return true if tileA is a bottom neighbor of tileB.
 * 
 * @param {object} tileA 
 * @param {object} tileB 
 */
export function isBottomNeighbor(tileA, tileB) {
    return tileA.col == tileB.col && tileA.row - 1 == tileB.row;
}

/**
 * return true if tileA is a left neighbor of tileB.
 * 
 * @param {object} tileA 
 * @param {object} tileB 
 */
export function isLeftNeighbor(tileA, tileB) {
    return tileA.row == tileB.row && tileA.col + 1 == tileB.col;
}

/**
 * return true if tileA is a right neighbor of tileB.
 * 
 * @param {object} tileA 
 * @param {object} tileB 
 */
export function isRightNeighbor(tileA, tileB) {
    return tileA.row == tileB.row && tileA.col - 1 == tileB.col;
}