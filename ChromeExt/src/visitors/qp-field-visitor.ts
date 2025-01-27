import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {
    QPField, QPFieldButton, QPFieldCheckbox,
    QPFieldElementType, QPFieldLabelValue,
    QPFieldMultilineTextEditor,
    QPFieldRadioButton, QPFieldSelector,
    QPFieldStatus,
} from "../elements/qp-field";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {
    concatElementID,
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

        return this.visitRadioButton(htmlElement, parent as AcuContainer)
            || this.visitSingleField(htmlElement, parent as AcuContainer);
    }

    private visitRadioButton(element: Element, parent: AcuContainer): boolean {
        if (element.getAttribute("control-type") !== "qp-radio") {
            return false;
        }
        const radioGroupElement = findElementByClassesDown(element, 'qp-radio-group');
        if (!radioGroupElement) {
            return true;
        }

        for (const radioElement of radioGroupElement.children) {
            const inputElement = findElementByNodeNameDown(radioElement, "input");
            if (!inputElement) {
                continue;
            }

            const field: QPFieldRadioButton = {
                Type: AcuElementType.Field,
                Id: concatElementID(parent.Id, element),
                ElementType: QPFieldElementType.RadioButton,
                Checked: inputElement?.getAttribute("checked") === "checked",
                RadioName: this.getLabel(radioElement),
                ReadOnly: isElementDisabled(element),
            };

            parent.Children.push(field);
        }

        return true;
    }

    visitSingleField(element: Element, parent: AcuContainer): boolean {
        const field = this.createField(element, parent.Id);
        if (!field) {
            return false;
        }

        field.ReadOnly = isElementDisabled(element);
        parent.Children.push(field);
        return true;
    }

    createField(element: Element, parentId: string): QPField | null {
        if (element.getAttribute("name") === "Status") {
            const enhancedComposeElement = findElementByNodeNameDown(element, "enhanced-compose");
            if (enhancedComposeElement) {
                const field: QPFieldStatus = {
                    Type: AcuElementType.Field,
                    ReadOnly: isElementDisabled(element),
                    ElementType: QPFieldElementType.Status,
                    Id: concatElementID(parentId, element),
                    Label: this.getLabel(element),
                    Value: findFirstLeafTextContent(enhancedComposeElement),
                };
                return field;
            }
        }

        const textAreaElement = findElementByNodeNameDown(element, "textarea")
        if (textAreaElement) {
            const field: QPFieldMultilineTextEditor = {
                Type: AcuElementType.Field,
                ReadOnly: isElementDisabled(element),
                ElementType: QPFieldElementType.MultilineTextEditor,
                Id: concatElementID(parentId, element),
                Label: this.getLabel(element),
                Value: textAreaElement?.textContent?.trim() ?? null,
            };
            return field;
        }

        if (findElementByClassesDown(element, 'qp-text-editor-control')) {
            return this.createFieldLabelValue(
                element,
                parentId,
                QPFieldElementType.TextEditor
            );
        }

        if (findElementByClassesDown(element, 'qp-selector-control')) {
            const field: QPFieldSelector = {
                Type: AcuElementType.Field,
                ReadOnly: isElementDisabled(element),
                ElementType: QPFieldElementType.Selector,
                Id: concatElementID(parentId, element),
                Label: this.getLabel(element),
                Value: this.getInputValue(element)
                    ?? this.getSelectorLink(element),
            };
            return field;
        }
        if (findElementByClassesDown(element, 'qp-drop-down-control')) {
            return this.createFieldLabelValue(
                element,
                parentId,
                QPFieldElementType.DropDown,
            );
        }

        if (findElementByClassesDown(element, 'qp-check-box-control')) {
            const input = findElementByNodeNameDown(element, 'input');
            const enhancedComposeElement = findElementByNodeNameDown(element, "enhanced-compose");

            const field: QPFieldCheckbox = {
                Type: AcuElementType.Field,
                ReadOnly: isElementDisabled(element),
                ElementType: QPFieldElementType.CheckBox,
                Id: concatElementID(parentId, element),
                CheckboxName: enhancedComposeElement ? this.getLabel(enhancedComposeElement) : null,
                Checked: input?.getAttribute("checked") === "checked",
            };
            return field;
        }

        if (findElementByClassesDown(element, 'qp-datetime-edit-control')) {
            return this.createFieldLabelValue(
                element,
                parentId,
                QPFieldElementType.DateTimeEdit,
            );
        }

        if (findElementByClassesDown(element, 'qp-currency-control')) {
            return this.createFieldLabelValue(
                element,
                parentId,
                QPFieldElementType.Currency
            );
        }

        if (findElementByClassesDown(element, 'qp-number-editor-control')) {
            return this.createFieldLabelValue(
                element,
                parentId,
                QPFieldElementType.NumberEditor
            );
        }

        const buttonElement = findElementByNodeNameDown(element, "qp-button");
        if (buttonElement) {
            const button = parseButton(element);
            const field: QPFieldButton = {
                Type: AcuElementType.Field,
                ReadOnly: !button.Enabled,
                ElementType: QPFieldElementType.Button,
                Id: concatElementID(parentId, element),
                Label: this.getLabel(element),
                Value: button.Text,
            };
            return field;
        }

        return null;
    }

    private createFieldLabelValue(element: Element, parentId: string, elementType: QPFieldElementType): QPFieldLabelValue {
        return {
            Type: AcuElementType.Field,
            ReadOnly: isElementDisabled(element),
            ElementType: elementType,
            Id: concatElementID(parentId, element),
            Label: this.getLabel(element),
            Value: this.getInputValue(element),
        };
    }

    private getLabel(htmlElement: Element): string | null {
        const labelElement = findElementByNodeNameDown(htmlElement, "label");
        if (!labelElement) {
            return null;
        }

        return labelElement.textContent?.trim() ?? null;
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