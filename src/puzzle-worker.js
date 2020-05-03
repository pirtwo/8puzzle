import Node from './tree-node';
import astar from './astar';
import goalFn from './goal';
import costFn from './cost';

onmessage = (msg) => {
    if (msg.data.start === true) {
        console.log('worker started.');

        let node = new Node({
            state: msg.data.state,
            cost: 0,
            parent: null,            
            operation: null
        });

        let answer = astar({
            node: node,
            goalTestFn: goalFn,
            calcCostFn: costFn
        });

        let actions = [];
        while (answer && answer.operation) {
            actions.push(answer.operation.name);
            answer = answer.parent;
        }        
        postMessage(actions.reverse());

        console.log('worker finished.');
    }
}