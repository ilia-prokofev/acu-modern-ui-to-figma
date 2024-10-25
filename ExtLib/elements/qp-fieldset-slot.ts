import {AcuElementType} from "./acu-element";
import {AcuContainer} from "./acu-container";

export interface QPFieldsetSlot extends AcuContainer {
    Type: AcuElementType.QPFieldSetSlot;
    ID: string;
}