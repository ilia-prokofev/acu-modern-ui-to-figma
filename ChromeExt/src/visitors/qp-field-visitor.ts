import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {QPField} from "../elements/qp-field";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";

export default class QPFieldVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        const child: QPField = {
            Type: AcuElementType.Field,
            ElementType: null,
            Value: null,
            Label: null,
            ReadOnly: false,
        };
        (parent as AcuContainer).Children.push(child);

        allVisitor.visitChildren(htmlElement, child);

        return true;
    }
}