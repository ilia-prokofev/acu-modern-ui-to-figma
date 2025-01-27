import {AcuElement, AcuElementType} from "./acu-element";

export enum QPFieldElementType {
    TextEditor = 'TextEditor',
    MultilineTextEditor = 'MultilineTextEditor',
    Selector = 'Selector',
    DropDown = 'DropDown',
    CheckBox = 'CheckBox',
    DateTimeEdit = 'DateTimeEdit',
    NumberEditor = 'NumberEditor',
    Button = 'Button',
    RadioButton = 'RadioButton',
    Status = 'Status',
    Currency = 'Currency',
    LabelFieldCheckbox = "LabelFieldCheckbox",
    HorizontalContainer = "HorizontalContainer",
}

export interface QPField extends AcuElement {
    Type: AcuElementType.Field;
    ElementType: QPFieldElementType | null;
    ReadOnly: boolean | null;
}

export interface QPFieldLabelValue extends QPField {
    Label: string | null;
    Value: string | null;
}

export interface QPFieldTextEditor extends QPFieldLabelValue {
    ElementType: QPFieldElementType.TextEditor;
}

export interface QPFieldMultilineTextEditor extends QPFieldLabelValue {
    ElementType: QPFieldElementType.MultilineTextEditor;
}

export interface QPFieldSelector extends QPFieldLabelValue {
    ElementType: QPFieldElementType.Selector;
}

export interface QPFieldDropDown extends QPFieldLabelValue {
    ElementType: QPFieldElementType.DropDown;
}

export interface QPFieldCheckbox extends QPField {
    ElementType: QPFieldElementType.CheckBox;
    Checked: boolean;
    CheckboxName: string;
}

export interface QPFieldDateTimeEdit extends QPFieldLabelValue {
    ElementType: QPFieldElementType.DateTimeEdit;
}

export interface QPFieldNumberEditor extends QPFieldLabelValue {
    ElementType: QPFieldElementType.NumberEditor;
}

export interface QPFieldButton extends QPFieldLabelValue {
    ElementType: QPFieldElementType.Button;
}

export interface QPFieldRadioButton extends QPField {
    ElementType: QPFieldElementType.RadioButton;
    Checked: boolean;
    RadioName: string;
}

export interface QPFieldStatus extends QPFieldLabelValue {
    ElementType: QPFieldElementType.Status;
}

export interface QPFieldCurrency extends QPFieldLabelValue {
    ElementType: QPFieldElementType.Currency;
}

export interface QPFieldLabelFieldCheckbox extends QPFieldLabelValue {
    ElementType: QPFieldElementType.LabelFieldCheckbox;
    Checkbox: QPFieldCheckbox;
}

export interface QPFieldHorizontalContainer extends QPField {
    ElementType: QPFieldElementType.HorizontalContainer;
    Fields: Array<QPField>;
}