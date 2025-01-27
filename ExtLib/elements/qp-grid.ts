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

export enum GridFooterType {
    WithCounters = "WithCounters",
    GI = "GI",
    Simple = "Simple",
}

export interface GridFooter {
    FooterType: GridFooterType;
}

export interface Grid extends QPToolbarContainer {
    Type: AcuElementType.Grid;
    Caption: string | null;
    Columns: GridColumn[];
    Footer: GridFooter | null;
}