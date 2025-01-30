import {FigmaNode} from './figma-node';
import {Root} from '@modern-ui-to-figma/elements';
import {figmaToolbar} from './figma-toolbar';
import {AcuElementType} from '@modern-ui-to-figma/elements';
import {figmaTemplate} from './figma-template';
import {Template} from '@modern-ui-to-figma/elements';
import {figmaSplitContainer} from './figma-split-container';
import {QPSplitContainer} from '@modern-ui-to-figma/elements';
import {figmaTabbar} from './figma-tabbar';
import {TabBar} from '@modern-ui-to-figma/elements';
import {figmaTree} from './figma-tree';
import {QPTree} from '@modern-ui-to-figma/elements';
import {figmaGrid} from './figma-grid';
import {Grid} from '@modern-ui-to-figma/elements';

export class figmaRoot extends FigmaNode {
    constructor(root: Root) {
        super('Canvas', 'FRAME');
        this.tryToFind = false;
        this.acuElement = root;

        if (root.ToolBar)
            this.children.push(new figmaToolbar(root.ToolBar));

        for (const fs of root.Children) {
            switch (fs.Type) {
            case AcuElementType.Template:
                this.children.push(new figmaTemplate(fs as Template));
                break;
            case AcuElementType.SplitContainer:
                this.children.push(new figmaSplitContainer(fs as QPSplitContainer));
                break;
            case AcuElementType.Tabbar:
                this.children.push(new figmaTabbar(fs as TabBar));
                break;
            case AcuElementType.Tree:
                this.children.push(new figmaTree(fs as QPTree));
                break;
            case AcuElementType.Grid:
                this.children.push(new figmaGrid(fs as Grid, 'Grid', true));
                break;
            }
        }
    }
}