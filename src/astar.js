export default function astar({
    node,
    goalTestFn = (currNode) => {},
    calcCostFn = (currNode) => {}
}) {
    let openList = [],
        closeList = [];

    node.cost = calcCostFn(node);
    openList.push(node);

    while (openList.length > 0) {
        let currNode = openList.sort((a, b) => b.cost - a.cost).pop();
        closeList.push(currNode);

        if (goalTestFn(currNode)) {
            console.log(currNode);
            console.log(`
            ------- A* stats -------
            depth: ${currNode.getDepth()}
            opens: ${openList.length}
            close: ${closeList.length}`);
            return currNode;
        }

        let successors = currNode.getSuccessors();
        successors.forEach(child => {
            if (closeList.indexOf(n => n.fingerprint == child.fingerprint) == -1) {
                child.cost = calcCostFn(child);
                openList.push(child);
            }
        });
    }



    // no answer at this point
    return null;
}