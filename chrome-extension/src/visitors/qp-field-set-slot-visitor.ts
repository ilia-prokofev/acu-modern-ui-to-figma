import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements';
import { AcuContainer } from '@modern-ui-to-figma/elements';
import { FieldsetSlot } from '@modern-ui-to-figma/elements';
import ElementVisitor from './qp-element-visitor';
import ChildrenVisitor from './children-visitors';
import { concatElementID } from './html-element-utils';

export default class QPFieldSetSlotVisitor implements ElementVisitor {
    constructor(private readonly childrenVisitor: ChildrenVisitor) {}

    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== 'div') {
            return false;
        }

        const slotAttr = htmlElement.attributes.getNamedItem('slot');
        if (!slotAttr) {
            return false;
        }

        const child: FieldsetSlot = {
            Type: AcuElementType.FieldsetSlot,
            Id: concatElementID(parent.Id, htmlElement),
            Children: [],
            ID: slotAttr.value,
        }

    ;(parent as AcuContainer).Children.push(child);

        this.childrenVisitor.visitChildren(htmlElement, child);

        return true;
    }
}
