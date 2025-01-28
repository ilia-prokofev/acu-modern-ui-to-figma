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
import {QPFieldCheckbox, QPFieldCurrency, QPFieldDropDown, QPFieldElementType} from "../elements/qp-field";
import {getFieldLabel, getInputValue, isFieldMandatory} from "./qp-field-utils";

export default class QPFieldCurrencyVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        if (!findElementByClassesDown(htmlElement, 'qp-currency-control')) {
            return false;
        }

        const field: QPFieldCurrency = {
            Type: AcuElementType.Field,
            ReadOnly: isElementDisabled(htmlElement),
            ElementType: QPFieldElementType.Currency,
            Id: concatElementID(parent.Id, htmlElement),
            Label: getFieldLabel(htmlElement),
            Value: getInputValue(htmlElement),
            Mandatory: isFieldMandatory(htmlElement),
        };

        (parent as AcuContainer).Children.push(field);
        return true;
    }
}