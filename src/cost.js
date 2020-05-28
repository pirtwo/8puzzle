import calcManhattanDistance from './manhattan-dist';
import calcPatternCost from './pattern-cost';

export default function cost(node) {
    let gn = node.parent ? node.parent.cost : 0;
    return gn + calcPatternCost(node);
}