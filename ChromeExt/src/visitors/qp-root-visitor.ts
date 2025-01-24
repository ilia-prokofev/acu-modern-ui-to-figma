import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import {Root} from "../elements/qp-root";
import {findClasses, findElementByClassesDown} from "./html-element-utils"
import ChildrenVisitor from "./children-visitors";

export default class QPRootVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (parent.Type !== AcuElementType.Root) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "div") {
            return false;
        }

        if (!findClasses(htmlElement, 'au-target', 'pageHeader')) {
            return false;
        }

        const captionLineElement = findElementByClassesDown(htmlElement, 'captionLine');
        if (captionLineElement && captionLineElement.children.length > 0) {
            (parent as Root).Title = captionLineElement.children[0].textContent?.trim() ?? null;
        }

        const userCaptionElement = findElementByClassesDown(htmlElement, 'usrCaption', 'au-target');
        if (userCaptionElement) {
            (parent as Root).Caption = userCaptionElement.textContent?.trim() ?? null;
        }

        allVisitor.visitChildren(htmlElement, parent);

        return true;
    }
}