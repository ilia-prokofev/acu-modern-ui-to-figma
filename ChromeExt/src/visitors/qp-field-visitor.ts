import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {QPField} from "../elements/qp-field";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {concatElementID, findClasses, isElementDisabled} from "./html-element-utils";

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
            Id: concatElementID(parent.Id, htmlElement),
            ElementType: null,
            Value: null,
            Label: null,
            ReadOnly: false,
        };

        allVisitor.visitChildren(htmlElement, child);
        if (!child.ElementType) {
            return false;
        }

        child.ReadOnly = isElementDisabled(htmlElement);

        (parent as AcuContainer).Children.push(child);
        return true;
    }
}