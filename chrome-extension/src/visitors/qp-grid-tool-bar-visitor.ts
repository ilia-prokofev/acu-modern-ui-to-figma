import ElementVisitor from './qp-element-visitor';
import { AcuElement } from '@modern-ui-to-figma/elements';
import { isQPToolbarContainer } from '@modern-ui-to-figma/elements';
import { findClasses, findElementByNodeNameDown } from './html-element-utils';
import ChildrenVisitor from './children-visitors';

export default class QPGridToolBarVisitor implements ElementVisitor {
    constructor(private readonly childrenVisitor: ChildrenVisitor) {}

    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!isQPToolbarContainer(parent)) {
            return false;
        }

        const gridToolBar = findClasses(htmlElement, 'grid-top-bar');
        if (!gridToolBar) {
            return false;
        }

        // Next visitors should create toolbar. If nobody does, we do nothing.
        this.childrenVisitor.visitChildren(htmlElement, parent);
        const toolBar = parent.ToolBar;
        if (!toolBar) {
            return false;
        }

        if (findElementByNodeNameDown(htmlElement, 'qp-filter-box')) {
            toolBar.ShowRightAction = true;
        }

        return true;
    }
}
