import {AcuElement, AcuElementType} from "./elements/acu-element";
import {QPField, QPFieldElementType} from "./elements/qp-field";
import {AcuContainer} from "./elements/acu-container";
import {QPFieldset} from "./elements/qp-fieldset";
import {FieldsetSlot} from "./elements/qp-fieldset-slot";
import {Template} from "./elements/qp-template";
import {Tab, TabBar} from "./elements/qp-tabbar";
import {Grid} from "./elements/qp-grid";

function findClasses(htmlElement: Element, ...classNames: string[]): boolean {
    const classAttr = htmlElement.attributes.getNamedItem("class")?.value;
    if (!classAttr) {
        return false;
    }

    const classes = classAttr.split(" ");
    for (const className of classNames) {
        if (classes.find(c => c === className) === undefined) {
            return false;
        }
    }

    return true;
}

function findElementByClassesUp(htmlElement: Element, ...classNames: string[]): Element | null {
    if (findClasses(htmlElement, ...classNames)) {
        return htmlElement;
    }

    if (!htmlElement.parentElement) {
        return null;
    }

    return findElementByClassesUp(htmlElement.parentElement, ...classNames);
}

function findElementByClassesDown(htmlElement: Element, ...classNames: string[]): Element | null {
    if (findClasses(htmlElement, ...classNames)) {
        return htmlElement;
    }

    for (let i = 0; i < htmlElement.children.length; i++) {
        const child = findElementByClassesDown(htmlElement.children[i], ...classNames);
        if (child) {
            return child;
        }
    }

    return null;
}

interface ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean;
}

class LabelVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (parent.Type !== AcuElementType.Field) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "label") {
            return false;
        }

        (parent as QPField).Label = htmlElement.textContent?.trim() ?? null;

        VisitChildren(htmlElement, parent);

        return true;
    }
}

class TextEditVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (parent.Type !== AcuElementType.Field) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "input") {
            return false;
        }

        const elementTypeElement = findElementByClassesUp(htmlElement, 'au-target', 'main-field');
        if (!elementTypeElement) {
            return false;
        }

        let elementType: QPFieldElementType | null = null;
        if (findClasses(elementTypeElement, 'qp-text-editor-control')) {
            elementType = QPFieldElementType.TextEditor;
        } else if (findClasses(elementTypeElement, 'qp-selector-control')) {
            elementType = QPFieldElementType.Selector;
        } else if (findClasses(elementTypeElement, 'qp-drop-down-control')) {
            elementType = QPFieldElementType.DropDown;
        } else if (findClasses(elementTypeElement, 'qp-check-box-control')) {
            elementType = QPFieldElementType.CheckBox;
        } else if (findClasses(elementTypeElement, 'qp-datetime-edit-control')) {
            elementType = QPFieldElementType.DatetimeEdit;
        } else if (findClasses(elementTypeElement, 'qp-currency-control')) {
            elementType = QPFieldElementType.Currency;
        } else if (findClasses(elementTypeElement, 'qp-number-editor-control')) {
            elementType = QPFieldElementType.NumberEditor;
        }

        (parent as QPField).ElementType = elementType ?? QPFieldElementType.TextEditor;
        (parent as QPField).Value = htmlElement.attributes.getNamedItem("value")?.value ?? null;

        VisitChildren(htmlElement, parent);

        return true;
    }
}

class QPFieldVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-field") {
            return false;
        }

        const child: QPField = {
            Type: AcuElementType.Field,
            ElementType: null,
            Value: null,
            Label: null,
        };
        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}

class QPFieldsetVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-fieldset") {
            return false;
        }

        const child: QPFieldset = {
            Label: null,
            Type: AcuElementType.FieldSet,
            Children: [],
            Class: htmlElement.attributes.getNamedItem("class")?.value ?? null,
        };

        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}

class QPFieldSetSlotVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "div") {
            return false;
        }

        const slotAttr = htmlElement.attributes.getNamedItem("slot");
        if (!slotAttr) {
            return false;
        }

        const child: FieldsetSlot = {
            Type: AcuElementType.FieldsetSlot,
            Children: [],
            ID: slotAttr.value,
        };

        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}

export class QPTemplateVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-template") {
            return false;
        }

        const child: Template = {
            Type: AcuElementType.Template,
            Name: htmlElement.attributes.getNamedItem("name")?.value ?? null,
            Children: [],
        };

        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}

export class QPTabBarVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "div") {
            return false;
        }

        if (!findClasses(htmlElement, 'qp-tabbar', 'au-target')) {
            return false;
        }

        const child: TabBar = {
            Type: AcuElementType.Tabbar,
            Children: [],
            Tabs: [],
        };

        const tabsContainer = findElementByClassesDown(htmlElement, 'qp-tabbar-wrapper', 'au-target');
        if (!tabsContainer) {
            return false;
        }

        for (let i = 0; i < tabsContainer.children.length; i++) {
            const tabElement = tabsContainer.children[i];
            if (!findClasses(tabElement, 'tab-header-container')) {
                continue;
            }

            if (tabElement.children.length === 0 ||
                tabElement.children[0].children.length === 0) {
                continue;
            }

            const tabLabelElement = tabElement.children[0].children[0];
            if (!findClasses(tabLabelElement, 'au-target')) {
                continue;
            }

            const tab: Tab = {
                Type: AcuElementType.Tab,
                Label: tabLabelElement.textContent?.trim() ?? '',
                IsActive: findClasses(tabElement, 'qp-tabbar-tab--first'),
            };

            child.Tabs.push(tab);
        }

        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}

export class QPGridVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-grid") {
            return false;
        }

        const child: Grid = {
            Type: AcuElementType.Grid,
            Columns: [],
        };

        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}

export

function Visit(htmlElement: Element, parent: AcuElement) {
    for (const visitor of AllVisitors) {
        if (visitor.visit(htmlElement, parent)) {
            return;
        }
    }
    VisitChildren(htmlElement, parent);
}

function VisitChildren(htmlElement: Element, parent: AcuElement) {
    for (let i = 0; i < htmlElement.children.length; i++) {
        Visit(htmlElement.children[i], parent);
    }
}

const AllVisitors: Array<ElementVisitor> = [
    new QPTemplateVisitor(),
    new QPFieldSetSlotVisitor(),
    new QPFieldsetVisitor(),
    new QPFieldVisitor(),
    new LabelVisitor(),
    new TextEditVisitor(),
    new QPTabBarVisitor(),
    new QPGridVisitor(),
];

export class AcuPageParser {
    parse(html: string): AcuElement | null {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const root: AcuContainer = {
            Type: AcuElementType.Root,
            Children: [],
        }

        Visit(doc.body, root);
        return root;
    }
}