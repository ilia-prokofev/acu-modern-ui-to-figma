import {AcuElement, AcuElementType} from "../elements/acu-element";
import {QPField, QPFieldElementType} from "../elements/qp-field";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";

export default class QPMultilineTextEditVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (parent.Type !== AcuElementType.Field) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "textarea") {
            return false;
        }

        (parent as QPField).ElementType = QPFieldElementType.MultilineTextEditor;
        (parent as QPField).Value = htmlElement.textContent?.trim() ?? null;

        allVisitor.visitChildren(htmlElement, parent);

        return true;
    }
}