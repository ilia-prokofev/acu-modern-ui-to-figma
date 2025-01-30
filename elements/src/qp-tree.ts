import {AcuElement, AcuElementType} from './acu-element';

export interface QPTree extends AcuElement {
    Type: AcuElementType.Tree;
    Caption: string | null;
}