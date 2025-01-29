import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "@modern-ui-to-figma/elements";
import {concatElementID, findElementByNodeNameDown, findFirstLeafTextContent} from "./html-element-utils";
import {QPTree} from "@modern-ui-to-figma/elements";

export default class QPTreeVisitor implements ElementVisitor {
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