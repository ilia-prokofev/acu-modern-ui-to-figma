import {AcuElement, AcuElementType} from "../elements/acu-element";
import {QPField, QPFieldElementType} from "../elements/qp-field";
import ElementVisitor from "./qp-element-visitor";
import {
    findClasses,
    findElementByClassesDown,
    findElementByClassesUp,
    findElementByNodeNameDown,
    findFirstLeafTextContent
} from "./html-element-utils";
import ChildrenVisitor from "./children-visitors";

export default class QPTextEditVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (parent.Type !== AcuElementType.Field) {
            return false;
        }

        const mainFieldElement = findElementByClassesUp(htmlElement, 'au-target', 'main-field');
        if (!mainFieldElement) {
            return false;
        }

        const field = parent as QPField;
        const textAreaElement = findElementByNodeNameDown(mainFieldElement, "textarea")
        if (textAreaElement) {
            field.Value = textAreaElement?.textContent?.trim() ?? null
            field.ElementType = QPFieldElementType.MultilineTextEditor;
        } else if (findClasses(mainFieldElement, 'qp-text-editor-control')) {
            field.Value = this.getInputValue(mainFieldElement);
            field.ElementType = QPFieldElementType.TextEditor;
        } else if (findClasses(mainFieldElement, 'qp-selector-control')) {
            field.ElementType = QPFieldElementType.Selector;
            field.Value = this.getInputValue(mainFieldElement)
                ?? this.getSelectorLink(mainFieldElement);
        } else if (findClasses(mainFieldElement, 'qp-drop-down-control')) {
            field.ElementType = QPFieldElementType.DropDown;
            field.Value = this.getInputValue(mainFieldElement);
        } else if (findClasses(mainFieldElement, 'qp-check-box-control')) {
            field.ElementType = QPFieldElementType.CheckBox;
            field.Value = this.getInputValue(mainFieldElement);
        } else if (findClasses(mainFieldElement, 'qp-datetime-edit-control')) {
            field.ElementType = QPFieldElementType.DatetimeEdit;
            field.Value = this.getInputValue(mainFieldElement);
        } else if (findClasses(mainFieldElement, 'qp-currency-control')) {
            field.ElementType = QPFieldElementType.Currency;
            field.Value = this.getInputValue(mainFieldElement);
        } else if (findClasses(mainFieldElement, 'qp-number-editor-control')) {
            field.ElementType = QPFieldElementType.NumberEditor;
            field.Value = this.getInputValue(mainFieldElement);
        }

        return true;
    }

    private getInputValue(element: Element): string | null {
        const input = findElementByNodeNameDown(element, 'input');
        return input?.attributes.getNamedItem("value")?.value ?? null;
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