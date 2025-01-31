import {FigmaNode} from './figma-node';
import {FieldsetSlot} from '@modern-ui-to-figma/elements';
import {QPSplitPanel} from '@modern-ui-to-figma/elements';
import {addChild} from './figma-main';

export class FigmaSlot extends FigmaNode {
    constructor(slot: FieldsetSlot | QPSplitPanel, width = 0) {
        super('slot', 'FRAME', width);
        this.tryToFind = false;
        this.acuElement = slot;

        for (const child of slot.Children)
            addChild(this, slot.Type, child, width);
    }
}