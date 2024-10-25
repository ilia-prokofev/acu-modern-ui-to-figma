import {AcuContainer} from "./acu-container";

export enum GridColumnType {
    Settings = "Settings",
    Notes = "Notes",
    Files = "Files",
    Text = "Text",
    Link = "Link",
    Checkbox = "Checkbox",
}

export interface GridColumn {
    Label: string;
    ColumnType: GridColumnType;
    Cells: string[];
}

export interface Grid extends AcuContainer {
    Columns: GridColumn[];
}