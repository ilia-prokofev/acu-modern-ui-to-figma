import {AcuElement, AcuElementType} from './acu-element';
import {AcuContainer} from './acu-container';

export interface QPSplitPanel extends AcuContainer {
    Type: AcuElementType.SplitPanel;
}

export enum QPSplitContainerOrientation {
    Vertical = 'Vertical',
    Horizontal = 'Horizontal',
}

export interface QPSplitContainer extends AcuElement {
    Type: AcuElementType.SplitContainer;
    Panel1: QPSplitPanel | null;
    Panel2: QPSplitPanel | null;
    Orientation: QPSplitContainerOrientation;
}