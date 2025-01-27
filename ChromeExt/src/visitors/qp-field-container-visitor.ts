import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {concatElementID, findAllElementByNodeNameDown, findElementByNodeNameDown} from "./html-element-utils";
import {QPFieldElementType, QPFieldHorizontalContainer} from "../elements/qp-field";
import {AcuContainer} from "../elements/acu-container";


export default class QPFieldContainerVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        const childFieldElements: Element[] = [];
        for (const childElement of htmlElement.children) {
            findAllElementByNodeNameDown(childElement, "qp-field", childFieldElements);
        }

        if (childFieldElements.length === 0) {
            return false;
        }

        const container: QPFieldHorizontalContainer = {
            Type: AcuElementType.Field,
            Id: concatElementID(parent.Id, htmlElement),
            Children: [],
            ReadOnly: false,
            ElementType: QPFieldElementType.HorizontalContainer,
        };
        (parent as AcuContainer).Children.push(container);

        for (const childFieldElement of childFieldElements) {
            allVisitor.visit(childFieldElement, container)
        }

        return true;
    }
}