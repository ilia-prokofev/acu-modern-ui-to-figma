import QPFieldVisitor from "./qp-field-visitor";
import ElementVisitor from "./element-visitor";
import AcuElement from "../elements/acu-element";
import LabelVisitor from "./label-visitor";
import TextEditVisitor from "./text-edit-visitor";
import QPFieldsetVisitor from "./qp-fieldset-visitor";

const AllVisitors: Array<ElementVisitor> = [
    new QPFieldsetVisitor(),
    new QPFieldVisitor(),
    new LabelVisitor(),
    new TextEditVisitor(),
];

export function Visit(htmlElement: HTMLElement, parent: AcuElement) {
    for (const visitor of AllVisitors) {
        if (visitor.visit(htmlElement, parent)) {
            return;
        }
    }
    VisitChildren(htmlElement, parent);
}

export function VisitChildren(htmlElement: HTMLElement, parent: AcuElement) {
    for (const child of htmlElement.children) {
        Visit(child as HTMLElement, parent);
    }
}
