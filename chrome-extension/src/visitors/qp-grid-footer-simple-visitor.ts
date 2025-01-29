import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";
import {findClasses} from "./html-element-utils";
import {Grid, GridFooterType} from "@modern-ui-to-figma/elements";

export default class QPGridFooterSimpleVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (parent.Type !== AcuElementType.Grid) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "ul") {
            return false;
        }

        if (!findClasses(htmlElement, "toolsList", "astable")) {
            return false;
        }

        (parent as Grid).Footer = {
            FooterType: GridFooterType.Simple,
        };

        return true;
    }
}