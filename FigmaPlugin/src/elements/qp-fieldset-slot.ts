import {AcuElementType} from "./acu-element";
import {AcuContainer} from "./acu-container";

export interface FieldsetSlot extends AcuContainer {
    Type: AcuElementType.FieldsetSlot;
    ID: string;
}