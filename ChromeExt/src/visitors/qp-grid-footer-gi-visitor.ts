import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {findClasses} from "./html-element-utils";
import {Grid, GridFooterType} from "../elements/qp-grid";

export default class QPGridFooterGIVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (parent.Type !== AcuElementType.Grid) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "div") {
            return false;
        }

        if (!findClasses(htmlElement, "grid-pager")) {
            return false;
        }

        (parent as Grid).Footer = {
            FooterType: GridFooterType.GI,
        };

        return true;
    }
}