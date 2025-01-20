import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {QPFieldset} from "../elements/qp-fieldset";
import ElementVisitor from "./qp-element-visitor";
import {findClasses, findElementByClassesDown} from "./html-element-utils";
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
            Children: [],
            Highlighted: findClasses(htmlElement, 'highlights-section'),
        };

        (parent as AcuContainer).Children.push(child);

        allVisitor.visitChildren(htmlElement, child);

        return true;
    }
}