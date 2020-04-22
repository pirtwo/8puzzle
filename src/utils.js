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