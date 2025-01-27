import {Root} from "./elements/qp-root";
import {AcuElement, AcuElementType} from "./elements/acu-element";
import ChildrenVisitor, {allVisitors} from "./visitors/children-visitors";

export class AcuPageParser {
    parse(html: string): AcuElement | null {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const allVisitor = new ChildrenVisitor(allVisitors);

        const root: Root = {
            Type: AcuElementType.Root,
            Children: [],
            Title: null,
            Caption: null,
            ToolBar: null,
            Id: "Root"
        }

        allVisitor.visitChildren(doc.body, root);

        return root;
    }
}