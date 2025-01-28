import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {
    concatElementID,
    findElementByClassesDown,
    findElementByNodeNameDown,
    isElementDisabled
} from "./html-element-utils";
import {QPFieldElementType, QPFieldRadioButton} from "../elements/qp-field";
import {getFieldLabel, isFieldMandatory} from "./qp-field-utils";

export default class QpFieldRadioButtonVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        if (htmlElement.getAttribute("control-type") !== "qp-radio") {
            return false;
        }

        const radioGroupElement = findElementByClassesDown(htmlElement, 'qp-radio-group');
        if (!radioGroupElement) {
            return true;
        }

        for (const radioElement of radioGroupElement.children) {
            const inputElement = findElementByNodeNameDown(radioElement, "input");
            if (!inputElement) {
                continue;
            }

            const field: QPFieldRadioButton = {
                Type: AcuElementType.Field,
                Id: concatElementID(parent.Id, htmlElement),
                ElementType: QPFieldElementType.RadioButton,
                Checked: inputElement?.getAttribute("checked") === "checked",
                RadioName: getFieldLabel(radioElement),
                ReadOnly: isElementDisabled(htmlElement),
                Mandatory: isFieldMandatory(htmlElement),
            };

            (parent as AcuContainer).Children.push(field);
        }

        return true;
    }
}