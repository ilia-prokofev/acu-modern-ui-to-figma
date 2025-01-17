import {AcuContainer} from "./acu-container";
import {AcuElement, AcuElementType} from "./acu-element";

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
    Alignment: string | null;
    Cells: string[];
}

export interface Grid extends AcuElement {
    Type: AcuElementType.Grid;
    Columns: GridColumn[];
}