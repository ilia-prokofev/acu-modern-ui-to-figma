import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {
    concatElementID,
    findElementByNodeNameDown,
    isElementDisabled
} from "./html-element-utils";
import {QPFieldElementType, QPFieldMultilineTextEditor, QPFieldStatus} from "../elements/qp-field";
import {getFieldLabel, isFieldMandatory} from "./qp-field-utils";

export default class QPFieldTextAreaVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        const textAreaElement = findElementByNodeNameDown(htmlElement, "textarea")
        if (!textAreaElement) {
            return false;
        }

        const field: QPFieldMultilineTextEditor = {
            Type: AcuElementType.Field,
            ReadOnly: isElementDisabled(htmlElement),
            ElementType: QPFieldElementType.MultilineTextEditor,
            Id: concatElementID(parent.Id, htmlElement),
            Label: getFieldLabel(htmlElement),
            Value: textAreaElement?.textContent?.trim() ?? null,
            Mandatory: isFieldMandatory(htmlElement),
        };

        (parent as AcuContainer).Children.push(field);
        return true;
    }
}