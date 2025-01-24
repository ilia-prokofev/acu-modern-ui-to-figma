import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {QPFieldset} from "../elements/qp-fieldset";
import ElementVisitor from "./qp-element-visitor";
import {concatElementID, findClasses, findElementByClassesDown} from "./html-element-utils";
import ChildrenVisitor from "./children-visitors";

export default class QPFieldsetVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-fieldset") {
            return false;
        }

        const captionElement = findElementByClassesDown(htmlElement, 'au-target', 'qp-caption');

        const child: QPFieldset = {
            Label: captionElement?.textContent?.trim() ?? null,
            Type: AcuElementType.FieldSet,
            Id: concatElementID(parent.Id, htmlElement),
            Children: [],
            Highlighted: findClasses(htmlElement, 'highlights-section'),
        };

        allVisitor.visitChildren(htmlElement, child);
        if (!child.Label && child.Children.length === 0) {
            return false;
        }

        (parent as AcuContainer).Children.push(child);
        return true;
    }
}