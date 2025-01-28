import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {
    concatElementID,
    findClasses, findElementByClassesDown,
    findElementByNodeNameAndClassesDown, findFirstLeafTextContent,
    isElementDisabled
} from "./html-element-utils";
import {QPFieldElementType, QPFieldSelector} from "../elements/qp-field";
import {getFieldLabel, getInputValue, isFieldMandatory} from "./qp-field-utils";

export default class QPFieldSelectorVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        if (!findElementByNodeNameAndClassesDown(htmlElement, "div", "qp-selector-control")) {
            return false;
        }

        const field: QPFieldSelector = {
            Type: AcuElementType.Field,
            ReadOnly: isElementDisabled(htmlElement),
            ElementType: QPFieldElementType.Selector,
            Id: concatElementID(parent.Id, htmlElement),
            Label: getFieldLabel(htmlElement),
            Value: getInputValue(htmlElement)
                ?? this.getSelectorLink(htmlElement),
            Mandatory: isFieldMandatory(htmlElement),
        };
        (parent as AcuContainer).Children.push(field);
        return true;
    }

    private getSelectorLink(element: Element): string | null {
        const selectorLinkElement = findElementByClassesDown(element, 'qp-selector-link');
        if (!selectorLinkElement) {
            return null;
        }

        let text: string | null = null;
        for (const child of selectorLinkElement.children) {
            const textContent = findFirstLeafTextContent(child)
            if (!textContent || textContent.length === 0) {
                continue;
            }

            if (!text) {
                text = '';
            }

            text += textContent;
        }

        return text;
    }
}