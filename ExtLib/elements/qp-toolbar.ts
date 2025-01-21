import {AcuElement, AcuElementType} from "./acu-element";

export enum QPToolBarItemType {
    Button = "Button",
    IconButton = "IconButton",
}

export interface QPToolBarItem {
    ItemType: QPToolBarItemType;
}

export interface QPToolBarItemButton {
    ItemType: QPToolBarItemType.Button;
    Text: string;
}

export enum QPToolBarItemIconButtonType {
    Refresh = "Refresh",
    Back = "Back",
    SaveAndBack = "SaveAndBack",
    Save = "Save",
    Undo = "Undo",
    Insert = "Insert",
    Edit = "Edit",
    AdjustColumns = "AdjustColumns",
    ExportToExcel = "ExportToExcel",
    Import = "Import",
    Delete = "Delete",
    Copy = "Copy",
    First = "First",
    Previous = "Previous",
    Next = "Next",
    Last = "Last",
    MenuOpener = "MenuOpener",
}

export interface QPToolBarItemIconButton {
    ItemType: QPToolBarItemType.IconButton;
    IconType: QPToolBarItemIconButtonType;
}

export interface QPToolBar extends AcuElement {
    Type: AcuElementType.ToolBar;
    Items: QPToolBarItem[];
    ShowRightAction: boolean;
    ShowSaveButton: boolean;
}
