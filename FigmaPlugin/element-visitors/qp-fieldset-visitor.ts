import ElementVisitor from "./element-visitor";
import AcuElement, {AcuElementType} from "../elements/acu-element";
import {VisitChildren} from "./all-visitors";
import {QPFieldset} from "../elements/qp-fieldset";
import {AcuContainer} from "../elements/acu-container";

export default class QPFieldsetVisitor implements ElementVisitor {
    visit(htmlElement: HTMLElement, parent: AcuElement): boolean {
        if (!(parent as AcuContainer).Children) {
            return false;
        }

        if (htmlElement.tagName.toLowerCase() !== "qp-fieldset") {
            return false;
        }

        const child: QPFieldset = {
            Type: AcuElementType.QPFieldSet,
            Children: [],
        };

        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}