import ElementVisitor from "./qp-element-visitor";
import {AcuElement} from "../elements/acu-element";

export default class ChildrenVisitor {
    constructor(private visitors: Array<ElementVisitor>) {
    }

    public visitChildren(htmlElement: Element, parent: AcuElement) {
        for (let i = 0; i < htmlElement.children.length; i++) {
            this.visit(htmlElement.children[i], parent);
        }
    }

    private visit(htmlElement: Element, parent: AcuElement) {
        for (const visitor of this.visitors) {
            if (visitor.visit(htmlElement, parent, this)) {
                return;
            }
        }
        this.visitChildren(htmlElement, parent);
    }
}