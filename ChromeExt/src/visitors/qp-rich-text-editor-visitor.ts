import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {QPRichTextEditor} from "../elements/qp-rich-text-editor";
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