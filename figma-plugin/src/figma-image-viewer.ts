import {FigmaNode} from './figma-node';
import {QPImage} from '@modern-ui-to-figma/elements';
import {compImageViewer} from './figma-main';

export class FigmaImageViewer extends FigmaNode {
    constructor(imageViewer: QPImage, width = 0) {
        super('ImageViewer');
        this.tryToFind = false;
        this.acuElement = imageViewer;
        this.componentNode = compImageViewer;
        this.width = width;
        this.componentProperties['Caption#6303:4'] = false;
    }
}