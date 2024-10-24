import AcuElement, {AcuElementType} from "../elements/acu-element";
import {VisitChildren} from "./all-visitors";
import ElementVisitor from "./element-visitor";
import {QPField} from "../elements/qp-field";
import {AcuContainer} from "../elements/acu-container";

export default class QPFieldVisitor implements ElementVisitor {
    visit(htmlElement: HTMLElement, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)) {
            return false;
        }

        if (htmlElement.tagName.toLowerCase() !== "qp-field") {
            return false;
        }

        const child: QPField = {
            Type: AcuElementType.QPField,
            ElementType: null,
            Value: null,
            Label: null,
        };
        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}