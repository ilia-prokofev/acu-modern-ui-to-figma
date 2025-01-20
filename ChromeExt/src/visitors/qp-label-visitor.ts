import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import {QPField} from "../elements/qp-field";
import ChildrenVisitor from "./children-visitors";

export default class QPLabelVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (parent.Type !== AcuElementType.Field) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "label") {
            return false;
        }

        (parent as QPField).Label = htmlElement.textContent?.trim() ?? null;

        allVisitor.visitChildren(htmlElement, parent);

        return true;
    }
}