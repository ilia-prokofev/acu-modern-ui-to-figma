import {AcuElement, AcuElementType} from "./acu-element";

export enum QPToolBarItemType {
    Button = "Button",
    IconButton = "IconButton",
    FilterButton = "FilterButton",
    FilterCombo = "FilterCombo",
    AddFilterButton = "AddFilterButton",
    MenuButton = "MenuButton",
    Separator = "Separator",
}

export interface QPToolBarItem {
    ItemType: QPToolBarItemType;
}

export interface QPToolBarItemButton {
    ItemType: QPToolBarItemType.Button;
    Text: string;
}

export interface QPToolBarItemFilterButton {
    ItemType: QPToolBarItemType.FilterButton;
    Text: string;
}

export interface QPToolBarItemFilterCombo {
    ItemType: QPToolBarItemType.FilterCombo;
    Text: string;
}

export interface QPToolBarItemAddFilterButton {
    ItemType: QPToolBarItemType.AddFilterButton;
}

export interface QPToolBarItemMenuButton {
    ItemType: QPToolBarItemType.MenuButton;
}

export interface QPToolBarItemSeparator {
    ItemType: QPToolBarItemType.Separator;
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

export enum QPToolBarType {
    Record = "Record",
    List = "List",
    FilterBar = "FilterBar",
}

export interface QPToolBar extends AcuElement {
    Type: AcuElementType.ToolBar;
    Items: QPToolBarItem[];
    ShowRightAction: boolean;
    ShowSaveButton: boolean;
    ToolBarType: QPToolBarType;
}
