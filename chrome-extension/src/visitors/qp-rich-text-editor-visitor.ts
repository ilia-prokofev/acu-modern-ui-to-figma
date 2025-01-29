import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "@modern-ui-to-figma/elements";
import {QPRichTextEditor} from "@modern-ui-to-figma/elements";
import {concatElementID} from "./html-element-utils";

export default class QPRichTextEditorVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-rich-text-editor") {
            return false;
        }

        const editor: QPRichTextEditor = {
            Type: AcuElementType.RichTextEditor,
            Id: concatElementID(parent.Id, htmlElement),
        };

        (parent as AcuContainer).Children.push(editor);
        return true;
    }
}