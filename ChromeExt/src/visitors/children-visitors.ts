import ElementVisitor from "./qp-element-visitor";
import {AcuElement} from "../elements/acu-element";
import {findClasses} from "./html-element-utils";

export default class ChildrenVisitor {
    constructor(private visitors: Array<ElementVisitor>) {
    }

    public visitChildren(htmlElement: Element, parent: AcuElement) {
        if (findClasses(htmlElement, "aurelia-hide")) {
            return;
        }

        for (const child of htmlElement.children) {
            this.visit(child, parent);
        }
    }

    private visit(htmlElement: Element, parent: AcuElement) {
        // for debug purposes
        const auTargetId = this.getElementPath(htmlElement, null);
        for (const visitor of this.visitors) {
            if (visitor.visit(htmlElement, parent, this)) {
                return;
            }
        }
        this.visitChildren(htmlElement, parent);
    }

    private getElementPath(htmlElement: Element, current: string | null): string {
        let auTargetId = htmlElement.getAttribute("au-target-id") ?? "<absent>";
        if (current) {
            auTargetId += "|" + current;
        }

        if (!htmlElement.parentElement) {
            return auTargetId;
        }

        return this.getElementPath(htmlElement.parentElement, auTargetId);
    }
}