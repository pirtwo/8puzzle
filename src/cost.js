import calcManhattanDistance from './manhattan-dist';

export default function cost(node) {
    let gn = node.parent ? node.parent.cost : 0;
    return gn + calcManhattanDistance(node);
}