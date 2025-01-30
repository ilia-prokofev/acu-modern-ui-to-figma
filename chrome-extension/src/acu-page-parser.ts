import { Root } from '@modern-ui-to-figma/elements';
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements';
import ChildrenVisitor from './visitors/children-visitors';

export class AcuPageParser {
    constructor(private readonly childrenVisitor: ChildrenVisitor) {
    }

    parse(html: string): AcuElement | null {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const root: Root = {
            Type: AcuElementType.Root,
            Children: [],
            Title: null,
            Caption: null,
            ToolBar: null,
            Id: 'Root',
        };

        this.childrenVisitor.visitChildren(doc.body, root);

        return root;
    }
}
