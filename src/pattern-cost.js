import patterndb from './8puzzle-pattern-db';

export default function calcPatternCost(node) {
    let p1 = node.state,
        p2 = node.state;

    [1, 2, 3, 4].forEach(num => p1 = p1.replace(`${num}`, '*'));
    [5, 6, 7, 8].forEach(num => p2 = p2.replace(`${num}`, '*'));

    return patterndb[p1] + patterndb[p2];
}