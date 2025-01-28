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
import {QPFieldCheckbox, QPFieldDropDown, QPFieldElementType} from "../elements/qp-field";
import {getFieldLabel, getInputValue, isFieldMandatory} from "./qp-field-utils";

export default class QPFieldCheckboxVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        if (!findElementByClassesDown(htmlElement, 'qp-check-box-control')) {
            return false;
        }

        const input = findElementByNodeNameDown(htmlElement, 'input');
        const enhancedComposeElement = findElementByNodeNameDown(htmlElement, "enhanced-compose");

        const field: QPFieldCheckbox = {
            Type: AcuElementType.Field,
            ReadOnly: isElementDisabled(htmlElement),
            ElementType: QPFieldElementType.CheckBox,
            Id: concatElementID(parent.Id, htmlElement),
            CheckboxName: enhancedComposeElement ? getFieldLabel(enhancedComposeElement) : null,
            Checked: input?.getAttribute("checked") === "checked",
            Mandatory: isFieldMandatory(htmlElement),
        };

        (parent as AcuContainer).Children.push(field);
        return true;
    }
}