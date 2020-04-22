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
        let currNode =
            openList.reduce((pre, cur) => pre = cur.cost < pre.cost ? cur : pre);
        openList.splice(openList.indexOf(currNode), 1);

        if(closeList.find(n => n.state == currNode.state) !== undefined)
            continue;

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
        for (let i = 0; i < successors.length; i++) {
            let child = successors[i];
            child.cost = calcCostFn(child);
            openList.push(child);
        }
    }
    // no answer at this point
    return null;
}