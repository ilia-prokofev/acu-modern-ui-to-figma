import {AcuContainer, AcuElement, AcuElementType, QPField, QPFieldElementType, QPFieldset} from "./elements";

interface ElementVisitor {
    visit(htmlElement: ChildNode, parent: AcuElement): boolean;
}

class LabelVisitor implements ElementVisitor {
    visit(htmlElement: ChildNode, parent: AcuElement): boolean {
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

class QPFieldVisitor implements ElementVisitor {
    visit(htmlElement: ChildNode, parent: AcuElement): boolean {
        if (!(parent as AcuContainer)) {
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
    visit(htmlElement: ChildNode, parent: AcuElement): boolean {
        if (!(parent as AcuContainer).Children) {
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

class TextEditVisitor implements ElementVisitor {
    visit(htmlElement: ChildNode, parent: AcuElement): boolean {
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

function Visit(htmlElement: ChildNode, parent: AcuElement) {
    for (const visitor of AllVisitors) {
        if (visitor.visit(htmlElement, parent)) {
            return;
        }
    }
    VisitChildren(htmlElement, parent);
}

function VisitChildren(htmlElement: ChildNode, parent: AcuElement) {
    htmlElement.childNodes.forEach(child => Visit(child as HTMLElement, parent));
}

const AllVisitors: Array<ElementVisitor> = [
    new QPFieldsetVisitor(),
    new QPFieldVisitor(),
    new LabelVisitor(),
    new TextEditVisitor(),
];

export class AcuPageParser {
    parse(html: string): AcuElement | null {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const node = doc.body.firstChild;

        if(!node) {
            return null;
        }

        const root: AcuContainer = {
            Type: AcuElementType.Root,
            Children: [],
        }

        Visit(node!, root);
        return root;
    }
}