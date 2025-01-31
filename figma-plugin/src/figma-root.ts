import {FigmaNode} from './figma-node';
import {Root} from '@modern-ui-to-figma/elements';
import {figmaToolbar} from './figma-toolbar';
import {addChild} from './figma-main';

export class FigmaRoot extends FigmaNode {
    constructor(root: Root) {
        super('Canvas', 'FRAME');
        this.tryToFind = false;
        this.acuElement = root;

        if (root.ToolBar)
            this.children.push(new figmaToolbar(root.ToolBar));

        for (const child of root.Children)
            addChild(this, root.Type, child, 0);
    }
}