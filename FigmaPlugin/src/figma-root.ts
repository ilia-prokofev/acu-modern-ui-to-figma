import {FigmaNode} from "./figma-node";
import {Root} from "./elements/qp-root";
import {figmaToolbar} from "./figma-toolbar";
import {AcuElementType} from "./elements/acu-element";
import {figmaTemplate} from "./figma-template";
import {Template} from "./elements/qp-template";
import {figmaSplitContainer} from "./figma-split-container";
import {QPSplitContainer} from "./elements/qp-split";
import {figmaTabbar} from "./figma-tabbar";
import {TabBar} from "./elements/qp-tabbar";
import {figmaTree} from "./figma-tree";
import {QPTree} from "./elements/qp-tree";
import {figmaGrid} from "./figma-grid";
import {Grid} from "./elements/qp-grid";

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