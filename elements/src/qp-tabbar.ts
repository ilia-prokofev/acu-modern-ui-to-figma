import {AcuContainer} from './acu-container';
import {AcuElement, AcuElementType} from './acu-element';

export interface Tab extends AcuElement {
    Type: AcuElementType.Tab;
    Label: string;
    IsActive: boolean;
}

export interface TabBar extends AcuContainer {
    Type: AcuElementType.Tabbar;
    Tabs: Tab[];
}