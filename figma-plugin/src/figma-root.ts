import {FigmaNode} from './figma-node';
import {Root} from '@modern-ui-to-figma/elements';
import {figmaToolbar} from './figma-toolbar';
import {AcuElementType} from '@modern-ui-to-figma/elements';
import {FigmaTemplate} from './figma-template';
import {Template} from '@modern-ui-to-figma/elements';
import {FigmaSplitContainer} from './figma-split-container';
import {QPSplitContainer} from '@modern-ui-to-figma/elements';
import {FigmaTabBar} from './figma-tab-bar';
import {TabBar} from '@modern-ui-to-figma/elements';
import {FigmaTree} from './figma-tree';
import {QPTree} from '@modern-ui-to-figma/elements';
import {FigmaGrid} from './figma-grid';
import {Grid} from '@modern-ui-to-figma/elements';
import {addChild} from "./figma-main";

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