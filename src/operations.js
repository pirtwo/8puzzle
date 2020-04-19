const OPERATIONS = {
    slideLeft: {
        name: 'slideLeft',
        getVelocity: getVelocity,
        fn: getDestination
    },
    slideRight: {
        name: 'slideRight',
        getVelocity: getVelocity,
        fn: getDestination
    },
    slideUp: {
        name: 'slideUp',
        getVelocity: getVelocity,
        fn: getDestination
    },
    slideDown: {
        name: 'slideDown',
        getVelocity: getVelocity,
        fn: getDestination
    },
}

function getDestination(row, col) {
    if (this.name == 'slideLeft') return {
        row: row,
        col: col - 1
    };

    if (this.name == 'slideRight') return {
        row: row,
        col: col + 1
    };

    if (this.name == 'slideUp') return {
        row: row - 1,
        col: col
    };

    if (this.name == 'slideDown') return {
        row: row + 1,
        col: col
    };
}

function getVelocity(speed) {
    if (this.name == 'slideLeft') return {
        vx: -speed,
        vy: 0
    };

    if (this.name == 'slideRight') return {
        vx: speed,
        vy: 0
    };

    if (this.name == 'slideUp') return {
        vx: 0,
        vy: -speed
    };

    if (this.name == 'slideDown') return {
        vx: 0,
        vy: speed
    };
}

export default OPERATIONS;