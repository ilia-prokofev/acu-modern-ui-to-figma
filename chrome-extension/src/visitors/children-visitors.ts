import ElementVisitor from "./qp-element-visitor";
import {AcuElement} from "@modern-ui-to-figma/elements";
import {findClasses} from "./html-element-utils";

export default class ChildrenVisitor {
    constructor(private visitors: ElementVisitor[]) {
    }

    public visitChildren(htmlElement: Element, parent: AcuElement) {
        if (findClasses(htmlElement, "aurelia-hide")) {
            return;
        }

        for (const child of htmlElement.children) {
            this.visit(child, parent);
        }
    }

    public visit(htmlElement: Element, parent: AcuElement) {
        if (findClasses(htmlElement, "aurelia-hide")) {
            return;
        }

        for (const visitor of this.visitors) {
            if (visitor.visit(htmlElement, parent, this)) {
                return;
            }
        }
        this.visitChildren(htmlElement, parent);
    }
}