import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {
    concatElementID,
    findElementByNodeNameAndClassesDown,
    isElementDisabled
} from "./html-element-utils";
import {QPFieldElementType, QPFieldSelector} from "../elements/qp-field";
import {getFieldLabel, getInputValue, isFieldMandatory} from "./qp-field-utils";
import {getSelectorLink} from "./selector-utils";

export default class QPFieldMaskEditorAttributeVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        if (!findElementByNodeNameAndClassesDown(htmlElement, "div", "qp-mask-editor-control")) {
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
        };
        (parent as AcuContainer).Children.push(field);
        return true;
    }
}