import {AcuContainer} from "./acu-container";
import {AcuElementType} from "./acu-element";
import {QPToolBar, QPToolbarContainer} from "./qp-toolbar";

export interface Root extends AcuContainer, QPToolbarContainer {
    Type: AcuElementType.Root;
    Title: string | null;
    Caption: string | null;
    ToolBar: QPToolBar | null;
}