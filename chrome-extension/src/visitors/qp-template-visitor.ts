import {AcuElement, AcuElementType, LabelLength, QPFieldsetStyle} from '@modern-ui-to-figma/elements';
import { AcuContainer } from '@modern-ui-to-figma/elements';
import { Template } from '@modern-ui-to-figma/elements';
import ElementVisitor from './qp-element-visitor';
import ChildrenVisitor from './children-visitors';
import {concatElementID, findClasses} from './html-element-utils';

export default class QPTemplateVisitor implements ElementVisitor {
    constructor(private readonly childrenVisitor: ChildrenVisitor) {}

    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== 'qp-template') {
            return false;
        }

        const child: Template = {
            Type: AcuElementType.Template,
            Id: concatElementID(parent.Id, htmlElement),
            Name: htmlElement.attributes.getNamedItem('name')?.value ?? null,
            Children: [],
            LabelLength: this.parseTemplateStyle(htmlElement),
        };

        (parent as AcuContainer).Children.push(child);
        this.childrenVisitor.visitChildren(htmlElement, child);
        return true;
    }

    private parseTemplateStyle(element: Element): LabelLength {
        if (findClasses(element, 'label-size-xm')) {
            return LabelLength.xm;
        }

        if (findClasses(element, 'label-size-m')) {
            return LabelLength.m;
        }

        if (findClasses(element, 'label-size-sm')) {
            return LabelLength.sm;
        }

        return LabelLength.s;
    }

}
