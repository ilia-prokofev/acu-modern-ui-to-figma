import {FigmaNode} from './figma-node';
import {Template} from '@modern-ui-to-figma/elements';
import {addChild, horizontalSpacing, viewportWidth} from './figma-main';

export class FigmaTemplate extends FigmaNode {
    constructor(template: Template, width = 0) {
        super('Template', 'FRAME', width == 0 ? viewportWidth : width);
        this.tryToFind = false;
        this.acuElement = template;
        this.layoutMode = 'HORIZONTAL';
        this.properties['counterAxisSizingMode'] = 'AUTO';
        if (template.Children.length == 0)
            this.properties['visible'] = false;

        const proportionalWidth = (this.width - (horizontalSpacing * (template.Children.length - 1))) / template.Children.length;
        const parts = template.Name?.split('-').map(p => parseInt(p)) ?? [];
        let sum = 0;
        parts?.forEach((part) => {
            sum += part;
        })

        let slotIndex = 0;
        for (const child of template.Children) {
            let slotWidth = proportionalWidth;
            if (sum > 0)
                slotWidth = (this.width - (horizontalSpacing * (template.Children.length - 1))) * parts[slotIndex++] / sum;
            addChild(this, template.Type, child, slotWidth);
        }
    }
}