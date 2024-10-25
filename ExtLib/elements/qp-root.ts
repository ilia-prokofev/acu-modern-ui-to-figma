import {AcuContainer} from "./acu-container";
import {AcuElementType} from "./acu-element";

export interface Root extends AcuContainer {
    Type: AcuElementType.Root;
    Caption1: string | null;
    Caption2: string | null;
}