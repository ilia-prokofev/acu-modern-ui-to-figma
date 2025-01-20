import {AcuElement, AcuElementType} from "../elements/acu-element";
import {QPField, QPFieldElementType} from "../elements/qp-field";
import ElementVisitor from "./qp-element-visitor";
import {findClasses, findElementByClassesUp} from "./html-element-utils";
import ChildrenVisitor from "./children-visitors";

export default class QPTextEditVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (parent.Type !== AcuElementType.Field) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "input") {
            return false;
        }

        const elementTypeElement = findElementByClassesUp(htmlElement, 'au-target', 'main-field');
        if (!elementTypeElement) {
            return false;
        }

        let elementType: QPFieldElementType | null = null;
        if (findClasses(elementTypeElement, 'qp-text-editor-control')) {
            elementType = QPFieldElementType.TextEditor;
        } else if (findClasses(elementTypeElement, 'qp-selector-control')) {
            elementType = QPFieldElementType.Selector;
        } else if (findClasses(elementTypeElement, 'qp-drop-down-control')) {
            elementType = QPFieldElementType.DropDown;
        } else if (findClasses(elementTypeElement, 'qp-check-box-control')) {
            elementType = QPFieldElementType.CheckBox;
        } else if (findClasses(elementTypeElement, 'qp-datetime-edit-control')) {
            elementType = QPFieldElementType.DatetimeEdit;
        } else if (findClasses(elementTypeElement, 'qp-currency-control')) {
            elementType = QPFieldElementType.Currency;
        } else if (findClasses(elementTypeElement, 'qp-number-editor-control')) {
            elementType = QPFieldElementType.NumberEditor;
        }

        (parent as QPField).ElementType = elementType ?? QPFieldElementType.TextEditor;
        (parent as QPField).Value = htmlElement.attributes.getNamedItem("value")?.value ?? null;

        allVisitor.visitChildren(htmlElement, parent);

        return true;
    }
}