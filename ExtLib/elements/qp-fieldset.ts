import {AcuContainer} from "./acu-container";
import {AcuElementType} from "./acu-element";

export interface QPFieldset extends AcuContainer {
    Type: AcuElementType.FieldSet;
    Label: string | null;
    Highlighted: boolean;
}