import {AcuElement, AcuElementType} from "./acu-element";

export enum QPFieldElementType {
    TextEditor = 'TextEditor',
    Selector = 'Selector',
    DropDown = 'DropDown',
    CheckBox = 'CheckBox',
    DatetimeEdit = 'DatetimeEdit',
    NumberEditor = 'NumberEditor',
    Status = 'Status',
    Currency = 'Currency'
  }

export interface QPField extends AcuElement {
    Type: AcuElementType.Field;
    Label: string;
    ElementType: QPFieldElementType;
    Value: string | null;
}