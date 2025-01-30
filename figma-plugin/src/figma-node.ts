import {AcuElement} from '@modern-ui-to-figma/elements';

export type figmaFieldTypes = 'INSTANCE' | 'FRAME';
export type figmaLayoutMode = 'NONE' | 'HORIZONTAL' | 'VERTICAL'

export class FigmaNode {
    childIndex: number = -1; // to find this instance in the children list of parent instance by index
    name: string; // to find this instance in nested items of the parent instance by name
    tryToFind = true;
    createIfNotFound = false;
    acuElement: AcuElement | null = null;
    height = 0;
    width = 0;
    componentProperties: { [propertyName: string]: string | boolean; } = {};
    properties: { [propertyName: string]: number | string | boolean | []; } = {};
    children: FigmaNode[] = [];
    type: figmaFieldTypes;
    componentNode: ComponentNode | null = null;
    layoutMode: figmaLayoutMode = 'VERTICAL';
    figmaObject: FrameNode | InstanceNode | null = null;
    detach = false;

    constructor(name: string, type: figmaFieldTypes = 'INSTANCE', width = 0, height = 0) {
        this.name = name;
        this.type = type;
        this.width = width;
        this.height = height;
    }
}