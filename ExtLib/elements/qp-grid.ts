import {AcuAlignment} from "./acu-alignment";
import {AcuElementType} from "./acu-element";
import {QPToolbarContainer} from "./qp-toolbar";

export enum GridColumnType {
    Settings = "Settings",
    Notes = "Notes",
    Files = "Files",
    Text = "Text",
    Link = "Link",
    Checkbox = "Checkbox",
}

export interface GridColumn {
    Type: AcuElementType.GridColumn
    Label: string;
    ColumnType: GridColumnType;
    Alignment: AcuAlignment;
    Cells: string[];
}

export interface Grid extends QPToolbarContainer {
    Type: AcuElementType.Grid;
    Columns: GridColumn[];
}