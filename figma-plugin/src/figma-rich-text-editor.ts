import {FigmaNode} from "./figma-node";
import {QPRichTextEditor} from "@modern-ui-to-figma/elements";
import {compRichTextEditor} from "./figma-main";

export class figmaRichTextEditor extends FigmaNode {
    constructor(richTextEditor: QPRichTextEditor, width = 0) {
        super('RichTextEditor');
        this.tryToFind = false;
        this.acuElement = richTextEditor;
        this.componentNode = compRichTextEditor;
        this.width = width;
        this.componentProperties['Header#5725:0'] = false;
    }
}