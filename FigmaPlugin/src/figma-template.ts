import {FigmaNode} from "./figma-node";
import {Template} from "./elements/qp-template";
import {AcuElementType} from "./elements/acu-element";
import {figmaFieldSet} from "./figma-field-set";
import {QPFieldset} from "./elements/qp-fieldset";
import {figmaSlot} from "./figma-slot";
import {FieldsetSlot} from "./elements/qp-fieldset-slot";
import {QPImage} from "./elements/qp-image";
import {QPRichTextEditor} from "./elements/qp-rich-text-editor";
import {QPTree} from "./elements/qp-tree";
import {Grid} from "./elements/qp-grid";
import {horizontalSpacing, viewportWidth} from "./figma-main";
import {figmaImageViewer} from "./figma-image-viewer";
import {figmaRichTextEditor} from "./figma-rich-text-editor";
import {figmaTree} from "./figma-tree";
import {figmaGrid} from "./figma-grid";

export class figmaTemplate extends FigmaNode {
    constructor(template: Template, width = 0) {
        super('Template', 'FRAME', width == 0 ? viewportWidth : width);
        this.tryToFind = false;
        this.acuElement = template;
        this.layoutMode = 'HORIZONTAL';
        this.properties['counterAxisSizingMode'] = 'AUTO';
        if (template.Children.length == 0)
            this.properties['visible'] = false;

        let proportionalWidth = (this.width - (horizontalSpacing * (template.Children.length - 1))) / template.Children.length;
        const parts = template.Name?.split('-').map(p => parseInt(p)) ?? [];
        let sum = 0;
        parts?.forEach((part, i) => {
            sum += part;
        })

        template.Children.forEach((fs, i) => {
            let slotWidth = proportionalWidth;
            if (sum > 0)
                slotWidth = (this.width - (horizontalSpacing * (template.Children.length - 1))) * parts[i] / sum;
            switch (fs.Type) {
                case AcuElementType.FieldSet:
                    this.children.push(new figmaFieldSet(fs as QPFieldset, slotWidth));
                    break;
                case AcuElementType.FieldsetSlot:
                    this.children.push(new figmaSlot(fs as FieldsetSlot, slotWidth));
                    break;
                case AcuElementType.Image:
                    this.children.push(new figmaImageViewer(fs as QPImage, slotWidth));
                    break;
                case AcuElementType.RichTextEditor:
                    this.children.push(new figmaRichTextEditor(fs as QPRichTextEditor, slotWidth));
                    break;
                case AcuElementType.Tree:
                    this.children.push(new figmaTree(fs as QPTree, slotWidth));
                    break;
                case AcuElementType.Grid:
                    const grid = new figmaGrid(fs as Grid, 'Grid', true);
                    grid.properties['layoutAlign'] = 'STRETCH';
                    grid.height = 250;
                    grid.width = slotWidth;
                    this.children.push(grid);
                    break;
            }
        });
    }
}