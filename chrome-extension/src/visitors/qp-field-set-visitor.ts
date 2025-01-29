import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import {AcuContainer} from "@modern-ui-to-figma/elements";
import {QPFieldset, QPFieldsetStyle} from "@modern-ui-to-figma/elements";
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
            Style: this.parseFieldSetStyle(htmlElement),
        };

        allVisitor.visitChildren(htmlElement, child);
        (parent as AcuContainer).Children.push(child);
        return true;
    }

    private parseFieldSetStyle(element: Element): QPFieldsetStyle {
        if (findClasses(element, "highlights-section")) {
            return QPFieldsetStyle.Blue;
        }

        if (findClasses(element, "transparent-section")) {
            return QPFieldsetStyle.Default;
        }

        return QPFieldsetStyle.Gray;
    }
}