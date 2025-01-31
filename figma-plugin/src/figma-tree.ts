import {FigmaNode} from './figma-node';
import {QPTree} from '@modern-ui-to-figma/elements';
import {compTree} from './figma-main';

export class FigmaTree extends FigmaNode {
    constructor(tree: QPTree, width = 0) {
        super('Tree');
        this.tryToFind = false;
        this.acuElement = tree;
        this.componentNode = compTree;
        this.width = width;
        this.componentProperties['Search#7892:1'] = false;

        if (tree.Caption) {
            this.componentProperties['Caption#7892:0'] = true;
            const caption = new FigmaNode('Group Header');
            caption.componentProperties['Text Value ▶#4494:3'] = tree.Caption!;
            this.children.push(caption);
        }
        else
            this.componentProperties['Caption#7892:0'] = false;
    }
}