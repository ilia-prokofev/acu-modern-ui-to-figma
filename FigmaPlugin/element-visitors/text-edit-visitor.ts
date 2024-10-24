import AcuElement, {AcuElementType} from "../elements/acu-element";
import ElementVisitor from "./element-visitor";
import {VisitChildren} from "./all-visitors";
import {QPField, QPFieldElementType} from "../elements/qp-field";

export default class TextEditVisitor implements ElementVisitor {
    visit(htmlElement: HTMLElement, parent: AcuElement): boolean {
        if (parent.Type !== AcuElementType.QPField) {
            return false;
        }

        if (htmlElement.tagName.toLowerCase() !== "input") {
            return false;
        }

        //(parent as QPField).Value = "some-edit-value";
        (parent as QPField).ElementType = QPFieldElementType.TextEditor;

        VisitChildren(htmlElement, parent);

        return true;
    }
}