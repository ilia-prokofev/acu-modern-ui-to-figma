import {AcuContainer} from "./acu-container";
import {AcuElementType} from "./acu-element";

export interface QPTemplate extends AcuContainer {
    Type: AcuElementType.QPTemplate;
    Name: string | null;
}