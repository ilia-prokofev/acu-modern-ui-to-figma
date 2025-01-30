import ElementVisitor from './qp-element-visitor';
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements';
import { Root } from '@modern-ui-to-figma/elements';
import { findClasses, findElementByClassesDown } from './html-element-utils';
import ChildrenVisitor from './children-visitors';

export default class QPRootVisitor implements ElementVisitor {
    constructor(private readonly childrenVisitor: ChildrenVisitor) {
    }

    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (parent.Type !== AcuElementType.Root) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== 'div') {
            return false;
        }

        if (!findClasses(htmlElement, 'au-target', 'pageHeader')) {
            return false;
        }

        const captionLineElement = findElementByClassesDown(
            htmlElement,
            'captionLine',
        );
        if (captionLineElement && captionLineElement.children.length > 0) {
            (parent as Root).Title =
        captionLineElement.children[0].textContent?.trim() ?? null;
        }

        const userCaptionElement = findElementByClassesDown(
            htmlElement,
            'usrCaption',
            'au-target',
        );
        if (userCaptionElement) {
            (parent as Root).Caption = userCaptionElement.textContent?.trim() ?? null;
        }

        this.childrenVisitor.visitChildren(htmlElement, parent);
        return true;
    }
}
