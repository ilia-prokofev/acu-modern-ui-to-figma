import {FigmaNode} from "./figma-node";
import {QPSplitContainer, QPSplitContainerOrientation} from "@modern-ui-to-figma/elements";
import {compSplitter, viewportWidth} from "./figma-main";
import {figmaSlot} from "./figma-slot";

class figmaSplitter extends FigmaNode {
    constructor(orientation: QPSplitContainerOrientation) {
        super('Splitter');
        this.tryToFind = false;
        this.componentNode = compSplitter;
        this.width = 16;
        this.properties['rotation'] = orientation == QPSplitContainerOrientation.Horizontal ? 0 : 90;
        this.properties['layoutAlign'] = 'STRETCH';
    }
}

export class figmaSplitContainer extends FigmaNode {
    constructor(splitContainer: QPSplitContainer, width = 0) {
        super('SplitContainer', 'FRAME');
        this.layoutMode = splitContainer.Orientation == QPSplitContainerOrientation.Vertical ? 'VERTICAL' : 'HORIZONTAL';
        this.properties['counterAxisSizingMode'] = 'AUTO';
        this.properties['itemSpacing'] = 0;
        this.tryToFind = false;
        this.acuElement = splitContainer;

        const splitterWidth = 16;
        let panelWidth = width == 0 ? viewportWidth : width;
        if (splitContainer.Orientation == QPSplitContainerOrientation.Horizontal)
            panelWidth = (panelWidth - splitterWidth) / 2;

        if (splitContainer.Panel1)
            this.children.push(new figmaSlot(splitContainer.Panel1, panelWidth));
        this.children.push(new figmaSplitter(splitContainer.Orientation));
        if (splitContainer.Panel2)
            this.children.push(new figmaSlot(splitContainer.Panel2, panelWidth));
    }
}