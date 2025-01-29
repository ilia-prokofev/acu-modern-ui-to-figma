import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {concatElementID, findElementByNodeNameDown, findFirstLeafTextContent} from "./html-element-utils";
import {QPTree} from "../elements/qp-tree";

export default class QpTreeVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-tree") {
            return false;
        }

        const treeToolBar = findElementByNodeNameDown(htmlElement, "qp-tree-toolbar")
        let caption: string | null = null;

        if (treeToolBar) {
            caption = findFirstLeafTextContent(treeToolBar);
        }

        const tree: QPTree = {
            Type: AcuElementType.Tree,
            Id: concatElementID(parent.Id, htmlElement),
            Caption: caption,
        };
        (parent as AcuContainer).Children.push(tree)
        return true;
    }
}