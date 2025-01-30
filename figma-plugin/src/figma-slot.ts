import {FigmaNode} from './figma-node';
import {FieldsetSlot} from '@modern-ui-to-figma/elements';
import {QPSplitContainer, QPSplitPanel} from '@modern-ui-to-figma/elements';
import {AcuElementType} from '@modern-ui-to-figma/elements';
import {Template} from '@modern-ui-to-figma/elements';
import {figmaSplitContainer} from './figma-split-container';
import {TabBar} from '@modern-ui-to-figma/elements';
import {QPFieldset} from '@modern-ui-to-figma/elements';
import {QPImage} from '@modern-ui-to-figma/elements';
import {QPRichTextEditor} from '@modern-ui-to-figma/elements';
import {QPTree} from '@modern-ui-to-figma/elements';
import {Grid} from '@modern-ui-to-figma/elements';
import {figmaTemplate} from './figma-template';
import {figmaTabbar} from './figma-tabbar';
import {figmaFieldSet} from './figma-field-set';
import {figmaImageViewer} from './figma-image-viewer';
import {figmaRichTextEditor} from './figma-rich-text-editor';
import {figmaTree} from './figma-tree';
import {figmaGrid} from './figma-grid';

export class figmaSlot extends FigmaNode {
    constructor(slot: FieldsetSlot | QPSplitPanel, width = 0) {
        super('slot', 'FRAME', width);
        this.tryToFind = false;
        this.acuElement = slot;

        slot.Children.forEach(fs => {
            switch (fs.Type) {
            case AcuElementType.Template:
                this.children.push(new figmaTemplate(fs as Template, width));
                break;
            case AcuElementType.SplitContainer:
                this.children.push(new figmaSplitContainer(fs as QPSplitContainer, width));
                break;
            case AcuElementType.Tabbar:
                this.children.push(new figmaTabbar(fs as TabBar, width));
                break;
            case AcuElementType.FieldSet:
                this.children.push(new figmaFieldSet(fs as QPFieldset, width));
                break;
            case AcuElementType.Image:
                this.children.push(new figmaImageViewer(fs as QPImage, width));
                break;
            case AcuElementType.RichTextEditor:
                this.children.push(new figmaRichTextEditor(fs as QPRichTextEditor, width));
                break;
            case AcuElementType.Tree:
                this.children.push(new figmaTree(fs as QPTree, width));
                break;
            case AcuElementType.Grid: {
                const grid = new figmaGrid(fs as Grid, 'Grid', true);
                grid.properties['layoutAlign'] = 'STRETCH';
                grid.height = 250;
                this.children.push(grid);
            }
                break;
            }
        });
    }
}