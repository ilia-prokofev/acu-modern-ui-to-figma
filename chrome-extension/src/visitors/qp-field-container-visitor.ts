import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";
import {concatElementID, findAllElementsByNodeNameDown} from "./html-element-utils";
import {QPFieldElementType, QPFieldHorizontalContainer} from "@modern-ui-to-figma/elements";
import {AcuContainer} from "@modern-ui-to-figma/elements";
import {getFieldLabel, isFieldMandatory} from "./qp-field-utils";


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
            findAllElementsByNodeNameDown(childElement, "qp-field", childFieldElements);
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
            Mandatory: isFieldMandatory(htmlElement),
            Label: getFieldLabel(htmlElement),
        };
        (parent as AcuContainer).Children.push(container);
        allVisitor.visitChildren(htmlElement, container);
        return true;
    }
}