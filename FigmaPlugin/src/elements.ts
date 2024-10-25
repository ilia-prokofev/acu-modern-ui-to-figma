export enum AcuElementType {
    QPField = 'QPField',
    QPFieldSet = 'QPFieldSet',
    Root = 'Root',
}

export interface AcuElement {
    Type: AcuElementType;
}

export interface AcuContainer extends AcuElement {
    Children: AcuElement[];
}

export enum QPFieldElementType {
    TextEditor = 'TextEditor',
    Currency = 'Currency'
}

export interface QPField extends AcuElement {
    Type: AcuElementType.QPField;
    Label: string | null;
    ElementType: QPFieldElementType | null;
    Value: string | null;
}

export interface QPFieldset extends AcuContainer {
    Type: AcuElementType.QPFieldSet;
}