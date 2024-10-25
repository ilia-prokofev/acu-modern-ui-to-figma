import {AcuContainer} from "./acu-container";

export interface Tab {
    Label: string;
    IsActive: boolean;
}

export interface TabBar extends AcuContainer {
    Tabs: Tab[];
}