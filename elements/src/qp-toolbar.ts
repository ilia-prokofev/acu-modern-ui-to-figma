import {AcuElement, AcuElementType} from './acu-element';
import {IconType} from './icon';
import {ButtonStyle, QPButton} from './qp-button';

export interface QPToolbarContainer extends AcuElement {
    ToolBar: QPToolBar | null;
}

export function isQPToolbarContainer(obj: unknown): obj is QPToolbarContainer {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'ToolBar' in obj
    );
}

export enum QPToolBarItemType {
    Button = 'Button',
    FilterButton = 'FilterButton',
    FilterCombo = 'FilterCombo',
    Separator = 'Separator',
}

export interface QPToolBarItem {
    ItemType: QPToolBarItemType;
}

export interface QPToolBarItemButton {
    ItemType: QPToolBarItemType.Button;
    Style: ButtonStyle;
    Enabled: boolean;
    Text: string | null;
    Icon: IconType | null;
}

export function toolBarButtonFromButton(button: QPButton): QPToolBarItemButton {
    return {
        ItemType: QPToolBarItemType.Button,
        Style: button.Style,
        Enabled: button.Enabled,
        Text: button.Text,
        Icon: button.Icon,
    } as QPToolBarItemButton;
}

export interface QPToolBarItemFilterButton {
    ItemType: QPToolBarItemType.FilterButton;
    Text: string;
}

export interface QPToolBarItemFilterCombo {
    ItemType: QPToolBarItemType.FilterCombo;
}

export interface QPToolBarItemSeparator {
    ItemType: QPToolBarItemType.Separator;
}

export enum QPToolBarType {
    Record = 'Record',
    List = 'List',
    FilterBar = 'FilterBar',
}

export interface QPToolBar extends AcuElement {
    Type: AcuElementType.ToolBar;
    Items: QPToolBarItem[];
    ShowRightAction: boolean;
    ShowSaveButton: boolean;
    ToolBarType: QPToolBarType;
}
