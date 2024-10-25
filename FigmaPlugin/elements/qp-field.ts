import AcuElement, {AcuElementType} from "./acu-element";

export enum QPFieldElementType {
    TextEditor = 'TextEditor',
    Currency = 'Currency'
}

export interface QPField extends AcuElement {
    Type: AcuElementType.QPField;
    Label: string;
    ElementType: QPFieldElementType;
    Value: string | null;
}
