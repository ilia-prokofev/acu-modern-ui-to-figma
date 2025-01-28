import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {QPSplitContainer, QPSplitContainerOrientation, QPSplitPanel} from "../elements/qp-split";
import {concatElementID, findElementByClassesDown} from "./html-element-utils";

export default class QPSplitterVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-splitter") {
            return false;
        }

        const orientation = findElementByClassesDown(htmlElement, "qp-splitter-width")
            ? QPSplitContainerOrientation.Horizontal
            : QPSplitContainerOrientation.Vertical;

        const splitContainer: QPSplitContainer = {
            Type: AcuElementType.SplitContainer,
            Id: concatElementID(parent.Id, htmlElement),
            Orientation: orientation,
            Panel1: null,
            Panel2: null,
        };

        const panel1 = this.createSplitPanel(htmlElement, "qp-splitter-first", splitContainer.Id, allVisitor);
        const panel2 = this.createSplitPanel(htmlElement, "qp-splitter-second", splitContainer.Id, allVisitor);

        splitContainer.Panel1 = panel1;
        splitContainer.Panel2 = panel2;

        (parent as AcuContainer).Children.push(splitContainer);
        return true;
    }

    createSplitPanel(
        htmlElement: Element,
        splitPanelAttribute: string,
        parentId: string,
        allVisitor: ChildrenVisitor,
    ): QPSplitPanel | null {
        const splitterElement = findElementByClassesDown(htmlElement, splitPanelAttribute);
        if (!splitterElement) {
            return null;
        }

        const panel: QPSplitPanel = {
            Type: AcuElementType.SplitPanel,
            Id: concatElementID(parentId, splitterElement),
            Children: []
        };
        allVisitor.visitChildren(splitterElement, panel)
        return panel;
    }
}