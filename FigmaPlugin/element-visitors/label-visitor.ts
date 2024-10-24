import {VisitChildren} from "./all-visitors";
import AcuElement, {AcuElementType} from "../elements/acu-element";
import ElementVisitor from "./element-visitor";
import {QPField} from "../elements/qp-field";

export default class LabelVisitor implements ElementVisitor {
    visit(htmlElement: HTMLElement, parent: AcuElement): boolean {
        if (parent.Type !== AcuElementType.QPField) {
            return false;
        }

        if (htmlElement.tagName.toLowerCase() !== "label") {
            return false;
        }

        (parent as QPField).Label = htmlElement.textContent;

        VisitChildren(htmlElement, parent);

        return true;
    }
}