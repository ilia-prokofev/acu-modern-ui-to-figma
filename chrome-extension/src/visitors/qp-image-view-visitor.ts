import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "@modern-ui-to-figma/elements";
import {concatElementID} from "./html-element-utils";
import {QPImage} from "@modern-ui-to-figma/elements";

export default class QPImageViewVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "image-view") {
            return false;
        }

        const image: QPImage = {
            Type: AcuElementType.Image,
            Id: concatElementID(parent.Id, htmlElement),
        };

        (parent as AcuContainer).Children.push(image);
        return true;
    }
}