import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {QPField, QPFieldElementType} from "../elements/qp-field";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {
    concatElementID,
    findClasses,
    findElementByClassesDown,
    findElementByNodeNameDown,
    findFirstLeafTextContent,
    isElementDisabled
} from "./html-element-utils";

export default class QPFieldVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        const field: QPField = {
            Type: AcuElementType.Field,
            Id: concatElementID(parent.Id, htmlElement),
            ElementType: QPFieldElementType.TextEditor,
            Value: null,
            Label: null,
            ReadOnly: true,
        };

        if (!this.visitLabel(htmlElement, field) ||
            !this.visitEditor(htmlElement, field)
        ) {
            return false;
        }

        field.ReadOnly = isElementDisabled(htmlElement);

        (parent as AcuContainer).Children.push(field);
        return true;
    }

    visitLabel(htmlElement: Element, field: QPField): boolean {
        const labelElement = findElementByNodeNameDown(htmlElement, "label");
        if (!labelElement) {
            return false;
        }

        field.Label = labelElement.textContent?.trim() ?? null;
        return true;
    }

    visitEditor(htmlElement: Element, field: QPField): boolean {
        const mainFieldElement = findElementByClassesDown(htmlElement, 'au-target', 'main-field');
        if (!mainFieldElement) {
            return false;
        }

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
            this.visitCheckBox(mainFieldElement, field);
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

    private visitCheckBox(element: Element, field: QPField) {
        const input = findElementByNodeNameDown(element, 'input');
        field.Value = input?.getAttribute("checked") === "checked" ? "on" : "off";
        field.Label = findElementByNodeNameDown(element, "label")?.textContent?.trim() ?? null;
    }
}