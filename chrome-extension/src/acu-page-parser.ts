import {Root} from "@modern-ui-to-figma/elements";
import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./visitors/children-visitors";
import {allVisitors} from "./visitors/all-visitors";

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