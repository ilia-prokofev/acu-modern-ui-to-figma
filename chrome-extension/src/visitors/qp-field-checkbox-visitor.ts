import ElementVisitor from './qp-element-visitor';
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements';
import { AcuContainer } from '@modern-ui-to-figma/elements';
import {
    concatElementID,
    findElementByClassesDown,
    findElementByNodeNameDown,
    isElementDisabled,
} from './html-element-utils';
import {
    QPFieldCheckbox,
    QPFieldElementType,
} from '@modern-ui-to-figma/elements';
import { getFieldLabel, isFieldMandatory } from './qp-field-utils';

export default class QPFieldCheckboxVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== 'qp-field') {
            return false;
        }

        if (!findElementByClassesDown(htmlElement, 'qp-check-box-control')) {
            return false;
        }

        const input = findElementByNodeNameDown(htmlElement, 'input');
        const enhancedComposeElement = findElementByNodeNameDown(
            htmlElement,
            'enhanced-compose',
        );

        const field: QPFieldCheckbox = {
            Type: AcuElementType.Field,
            ReadOnly: isElementDisabled(htmlElement),
            ElementType: QPFieldElementType.CheckBox,
            Id: concatElementID(parent.Id, htmlElement),
            CheckboxName: enhancedComposeElement
                ? getFieldLabel(enhancedComposeElement)
                : null,
            Checked: input?.getAttribute('checked') === 'checked',
            Mandatory: isFieldMandatory(htmlElement),
        }

    ;(parent as AcuContainer).Children.push(field);
        return true;
    }
}
