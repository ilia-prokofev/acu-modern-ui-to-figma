import ElementVisitor from "./qp-element-visitor";
import {AcuElement} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";
import {
    isQPToolbarContainer,
    QPToolbarContainer
} from "@modern-ui-to-figma/elements";
import {findClasses, findElementByNodeNameDown} from "./html-element-utils";

export default class QPGridToolBarVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!isQPToolbarContainer(parent)) {
            return false;
        }

        const gridToolBar = findClasses(htmlElement, "grid-top-bar");
        if (!gridToolBar) {
            return false;
        }

        // Next visitors should create toolbar. If nobody does, we do nothing.
        allVisitor.visitChildren(htmlElement, parent);
        const toolBar = (parent as QPToolbarContainer).ToolBar;
        if (!toolBar) {
            return false;
        }

        if (findElementByNodeNameDown(htmlElement, "qp-filter-box")) {
            toolBar.ShowRightAction = true;
        }

        return true;
    }
}