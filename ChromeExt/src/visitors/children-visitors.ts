import ElementVisitor from "./qp-element-visitor";
import {AcuElement} from "../elements/acu-element";
import {findClasses} from "./html-element-utils";
import QPRootVisitor from "./qp-root-visitor";
import QPToolBarVisitor from "./qp-tool-bar-visitor";
import QPFilterBarVisitor from "./qp-filter-bar-visitor";
import QPTemplateVisitor from "./qp-template-visitor";
import QPFieldSetSlotVisitor from "./qp-field-set-slot-visitor";
import QPFieldsetVisitor from "./qp-field-set-visitor";
import QPFieldContainerVisitor from "./qp-field-container-visitor";
import QPFieldVisitor from "./qp-field-visitor";
import QPTabBarVisitor from "./qp-tab-bar-visitor";
import QPGridVisitor from "./qp-grid-visitor";
import QPGridToolBarVisitor from "./qp-grid-tool-bar-visitor";
import QPGridFooterGIVisitor from "./qp-grid-footer-gi-visitor";
import QPGridFooterSimpleVisitor from "./qp-grid-footer-simple-visitor";

export const allVisitors: ElementVisitor[] = [
    new QPRootVisitor(),
    new QPToolBarVisitor(),
    new QPFilterBarVisitor(),
    new QPTemplateVisitor(),
    new QPFieldSetSlotVisitor(),
    new QPFieldsetVisitor(),
    new QPFieldContainerVisitor(),
    new QPFieldVisitor(),
    new QPTabBarVisitor(),
    new QPGridVisitor(),
    new QPGridToolBarVisitor(),
    new QPGridFooterGIVisitor(),
    new QPGridFooterSimpleVisitor(),
];

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