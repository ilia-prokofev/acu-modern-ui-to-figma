import {FigmaNode} from "./figma-node";
import {QPImage} from "./elements/qp-image";
import {compImageViewer} from "./figma-main";

export class figmaImageViewer extends FigmaNode {
    constructor(imageViewer: QPImage, width = 0) {
        super('ImageViewer');
        this.tryToFind = false;
        this.acuElement = imageViewer;
        this.componentNode = compImageViewer;
        this.width = width;
        this.componentProperties['Caption#6303:4'] = false;
    }
}