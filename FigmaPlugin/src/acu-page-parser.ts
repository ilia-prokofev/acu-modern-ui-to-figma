import {AcuContainer, AcuElement, AcuElementType, QPField, QPFieldElementType, QPFieldset} from "./elements";
import {JSDOM} from "jsdom";

interface ElementVisitor {
    visit(htmlElement: Node, parent: AcuElement): boolean;
}

class LabelVisitor implements ElementVisitor {
    visit(htmlElement: Node, parent: AcuElement): boolean {
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
    visit(htmlElement: Node, parent: AcuElement): boolean {
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
    visit(htmlElement: Node, parent: AcuElement): boolean {
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
    visit(htmlElement: Node, parent: AcuElement): boolean {
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

function Visit(htmlElement: Node, parent: AcuElement) {
    for (const visitor of AllVisitors) {
        if (visitor.visit(htmlElement, parent)) {
            return;
        }
    }
    VisitChildren(htmlElement, parent);
}

function VisitChildren(htmlElement: Node, parent: AcuElement) {
    htmlElement.childNodes.forEach(child => Visit(child as HTMLElement, parent));
}

const AllVisitors: Array<ElementVisitor> = [
    new QPFieldsetVisitor(),
    new QPFieldVisitor(),
    new LabelVisitor(),
    new TextEditVisitor(),
];

export class AcuPageParser {
    async parse(html: string): Promise<AcuElement | null> {
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const root: AcuContainer = {
            Type: AcuElementType.Root,
            Children: [],
        }

        VisitChildren(document.body, root);
        return root;
    }
}