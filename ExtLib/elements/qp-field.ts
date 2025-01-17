import {AcuElement, AcuElementType} from "./acu-element";

export enum QPFieldElementType {
    TextEditor = 'TextEditor',
    MultilineTextEditor = 'MultilineTextEditor',
    Selector = 'Selector',
    DropDown = 'DropDown',
    CheckBox = 'CheckBox',
    DatetimeEdit = 'DatetimeEdit',
    NumberEditor = 'NumberEditor',
    Button = 'Button',
    RadioButton = 'RadioButton',
    Status = 'Status',
    Currency = 'Currency'
}

export interface QPField extends AcuElement {
    Type: AcuElementType.Field;
    Label: string | null;
    ElementType: QPFieldElementType | null;
	ReadOnly: boolean | null;
    Value: string | null;
}