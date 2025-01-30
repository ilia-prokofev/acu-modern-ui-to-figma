import ElementVisitor from './qp-element-visitor';
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements';
import { AcuContainer } from '@modern-ui-to-figma/elements';
import {
    concatElementID,
    findElementByNodeNameAndClassesDown,
    isElementDisabled,
} from './html-element-utils';
import {
    QPFieldElementType,
    QPFieldSelector,
} from '@modern-ui-to-figma/elements';
import {
    getFieldLabel,
    getInputValue,
    isFieldMandatory,
} from './qp-field-utils';
import { getSelectorLink } from './selector-utils';

export default class QPFieldSelectorVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== 'qp-field') {
            return false;
        }

        if (
            !findElementByNodeNameAndClassesDown(
                htmlElement,
                'div',
                'qp-selector-control',
            )
        ) {
            return false;
        }

        const field: QPFieldSelector = {
            Type: AcuElementType.Field,
            ReadOnly: isElementDisabled(htmlElement),
            ElementType: QPFieldElementType.Selector,
            Id: concatElementID(parent.Id, htmlElement),
            Label: getFieldLabel(htmlElement),
            Value: getInputValue(htmlElement) ?? getSelectorLink(htmlElement),
            Mandatory: isFieldMandatory(htmlElement),
        }
    ;(parent as AcuContainer).Children.push(field);
        return true;
    }
}
