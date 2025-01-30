import ElementVisitor from './qp-element-visitor';
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements';
import ChildrenVisitor from './children-visitors';
import { AcuContainer } from '@modern-ui-to-figma/elements';
import {
    QPSplitContainer,
    QPSplitContainerOrientation,
    QPSplitPanel,
} from '@modern-ui-to-figma/elements';
import { concatElementID, findElementByClassesDown } from './html-element-utils';

export default class QPSplitterVisitor implements ElementVisitor {
    constructor(private readonly childrenVisitor: ChildrenVisitor) {}

    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== 'qp-splitter') {
            return false;
        }

        const orientation = findElementByClassesDown(
            htmlElement,
            'qp-splitter-width',
        )
            ? QPSplitContainerOrientation.Horizontal
            : QPSplitContainerOrientation.Vertical;

        const splitContainer: QPSplitContainer = {
            Type: AcuElementType.SplitContainer,
            Id: concatElementID(parent.Id, htmlElement),
            Orientation: orientation,
            Panel1: null,
            Panel2: null,
        };

        const panel1 = this.createSplitPanel(
            htmlElement,
            'qp-splitter-first',
            splitContainer.Id,
            this.childrenVisitor,
        );
        const panel2 = this.createSplitPanel(
            htmlElement,
            'qp-splitter-second',
            splitContainer.Id,
            this.childrenVisitor,
        );

        splitContainer.Panel1 = panel1;
        splitContainer.Panel2 = panel2

        ;(parent as AcuContainer).Children.push(splitContainer);
        return true;
    }

    createSplitPanel(
        htmlElement: Element,
        splitPanelAttribute: string,
        parentId: string,
        allVisitor: ChildrenVisitor,
    ): QPSplitPanel | null {
        const splitterElement = findElementByClassesDown(
            htmlElement,
            splitPanelAttribute,
        );
        if (!splitterElement) {
            return null;
        }

        const panel: QPSplitPanel = {
            Type: AcuElementType.SplitPanel,
            Id: concatElementID(parentId, splitterElement),
            Children: [],
        };
        allVisitor.visitChildren(splitterElement, panel);
        return panel;
    }
}
