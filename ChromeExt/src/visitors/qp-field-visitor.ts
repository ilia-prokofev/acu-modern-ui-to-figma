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
import {parseButton} from "./button-utils";

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

        this.visitLabel(htmlElement, field)
        if (!this.visitEditor(htmlElement, field)) {
            return false;
        }

        field.ReadOnly = isElementDisabled(htmlElement);

        (parent as AcuContainer).Children.push(field);
        return true;
    }

    visitLabel(htmlElement: Element, field: QPField) {
        const labelElement = findElementByNodeNameDown(htmlElement, "label");
        if (!labelElement) {
            return;
        }

        field.Label = labelElement.textContent?.trim() ?? null;
        return;
    }

    visitEditor(element: Element, field: QPField): boolean {
        const textAreaElement = findElementByNodeNameDown(element, "textarea")
        if (textAreaElement) {
            field.Value = textAreaElement?.textContent?.trim() ?? null
            field.ElementType = QPFieldElementType.MultilineTextEditor;
            return true;
        }

        if (findElementByClassesDown(element, 'qp-text-editor-control')) {
            field.Value = this.getInputValue(element);
            field.ElementType = QPFieldElementType.TextEditor;
            return true;
        }

        if (findElementByClassesDown(element, 'qp-selector-control')) {
            field.ElementType = QPFieldElementType.Selector;
            field.Value = this.getInputValue(element)
                ?? this.getSelectorLink(element);

            return true;
        }
        if (findElementByClassesDown(element, 'qp-drop-down-control')) {
            field.ElementType = QPFieldElementType.DropDown;
            field.Value = this.getInputValue(element);

            return true;
        }

        if (findElementByClassesDown(element, 'qp-check-box-control')) {
            field.ElementType = QPFieldElementType.CheckBox;
            this.visitCheckBox(element, field);

            return true;
        }

        if (findElementByClassesDown(element, 'qp-datetime-edit-control')) {
            field.ElementType = QPFieldElementType.DatetimeEdit;
            field.Value = this.getInputValue(element);

            return true;
        }

        if (findElementByClassesDown(element, 'qp-currency-control')) {
            field.ElementType = QPFieldElementType.Currency;
            field.Value = this.getInputValue(element);

            return true;
        }

        if (findElementByClassesDown(element, 'qp-number-editor-control')) {
            field.ElementType = QPFieldElementType.NumberEditor;
            field.Value = this.getInputValue(element);

            return true;
        }

        const buttonElement = findElementByNodeNameDown(element, "qp-button");
        if (buttonElement) {
            const button = parseButton(element);
            field.ReadOnly = !button.Enabled;
            field.Value = button.Text;
            field.ElementType = QPFieldElementType.Button;
            return true;
        }

        return false;
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

        const enhancedComposeElement = findElementByNodeNameDown(element, "enhanced-compose");
        if (enhancedComposeElement) {
            this.visitLabel(enhancedComposeElement, field);
        }
    }
}