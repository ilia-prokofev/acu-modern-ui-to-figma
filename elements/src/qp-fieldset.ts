import {AcuContainer} from "./acu-container";
import {AcuElementType} from "./acu-element";

export enum QPFieldsetStyle {
    Default = "Default",
    Gray = "Gray",
    Blue = "Blue",
}

export interface QPFieldset extends AcuContainer {
    Type: AcuElementType.FieldSet;
    Label: string | null;
    Style: QPFieldsetStyle;
}