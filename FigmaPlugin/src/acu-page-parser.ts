import {AcuElement, AcuElementType} from "./elements/acu-element";
import {QPField, QPFieldElementType} from "./elements/qp-field";
import {AcuContainer} from "./elements/acu-container";
import {QPFieldset} from "./elements/qp-fieldset";
import {QPFieldsetSlot} from "./elements/qp-fieldset-slot";
import {QPTemplate} from "./elements/qp-template";

interface ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean;
}

class LabelVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (parent.Type !== AcuElementType.QPField) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "label") {
            return false;
        }

        (parent as QPField).Label = htmlElement.textContent;

        VisitChildren(htmlElement, parent);

        return true;
    }
}

class TextEditVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (parent.Type !== AcuElementType.QPField) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "input") {
            return false;
        }

        //(parent as QPField).Value = "some-edit-value";
        (parent as QPField).ElementType = QPFieldElementType.TextEditor;

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
            Type: AcuElementType.QPField,
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
            Type: AcuElementType.QPFieldSet,
            Children: [],
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

        const child: QPFieldsetSlot = {
            Type: AcuElementType.QPFieldSetSlot,
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

        const child: QPTemplate = {
            Type: AcuElementType.QPTemplate,
            Name: htmlElement.attributes.getNamedItem("name")?.value ?? null,
            Children: [],
        };

        (parent as AcuContainer).Children.push(child);

        VisitChildren(htmlElement, child);

        return true;
    }
}

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