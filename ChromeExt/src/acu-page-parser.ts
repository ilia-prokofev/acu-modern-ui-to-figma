import {Root} from "./elements/qp-root";
import {AcuElement, AcuElementType} from "./elements/acu-element";
import ChildrenVisitor from "./visitors/children-visitors";
import ElementVisitor from "./visitors/qp-element-visitor";
import QPGridVisitor from "./visitors/qp-grid-visitor";
import QPTabBarVisitor from "./visitors/qp-tab-bar-visitor";
import QPFieldVisitor from "./visitors/qp-field-visitor";
import QPFieldsetVisitor from "./visitors/qp-field-set-visitor";
import QPFieldSetSlotVisitor from "./visitors/qp-field-set-slot-visitor";
import QPTemplateVisitor from "./visitors/qp-template-visitor";
import QPRootVisitor from "./visitors/qp-root-visitor";
import QPToolBarVisitor from "./visitors/qp-tool-bar-visitor";
import QPFilterBarVisitor from "./visitors/qp-filter-bar-visitor";
import QPGridToolBarVisitor from "./visitors/qp-grid-tool-bar-visitor";

export class AcuPageParser {
    parse(html: string): AcuElement | null {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const allVisitors: Array<ElementVisitor> = [
            new QPRootVisitor(),
            new QPTemplateVisitor(),
            new QPFieldSetSlotVisitor(),
            new QPFieldsetVisitor(),
            new QPFieldVisitor(),
            new QPTabBarVisitor(),
            new QPGridVisitor(),
            new QPToolBarVisitor(),
            new QPFilterBarVisitor(),
            new QPGridToolBarVisitor(),
        ];
        const allVisitor = new ChildrenVisitor(allVisitors);

        const root: Root = {
            Type: AcuElementType.Root,
            Children: [],
            Caption1: null,
            Caption2: null,
            ToolBar: null,
            Id: "Root"
        }

        allVisitor.visitChildren(doc.body, root);

        return root;
    }
}