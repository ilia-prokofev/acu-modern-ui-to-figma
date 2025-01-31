import {FigmaNode} from './figma-node';
import {FieldsetSlot} from '@modern-ui-to-figma/elements';
import {QPSplitContainer, QPSplitPanel} from '@modern-ui-to-figma/elements';
import {AcuElementType} from '@modern-ui-to-figma/elements';
import {Template} from '@modern-ui-to-figma/elements';
import {FigmaSplitContainer} from './figma-split-container';
import {TabBar} from '@modern-ui-to-figma/elements';
import {QPFieldset} from '@modern-ui-to-figma/elements';
import {QPImage} from '@modern-ui-to-figma/elements';
import {QPRichTextEditor} from '@modern-ui-to-figma/elements';
import {QPTree} from '@modern-ui-to-figma/elements';
import {Grid} from '@modern-ui-to-figma/elements';
import {FigmaTemplate} from './figma-template';
import {FigmaTabBar} from './figma-tab-bar';
import {FigmaFieldSet} from './figma-field-set';
import {FigmaImageViewer} from './figma-image-viewer';
import {FigmaRichTextEditor} from './figma-rich-text-editor';
import {FigmaTree} from './figma-tree';
import {FigmaGrid} from './figma-grid';
import {addChild} from "./figma-main";

export class FigmaSlot extends FigmaNode {
    constructor(slot: FieldsetSlot | QPSplitPanel, width = 0) {
        super('slot', 'FRAME', width);
        this.tryToFind = false;
        this.acuElement = slot;

        for (const child of slot.Children)
            addChild(this, slot.Type, child, width);
    }
}