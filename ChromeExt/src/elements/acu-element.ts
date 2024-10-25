export enum AcuElementType {
    QPField = 'QPField',
    QPFieldSet = 'QPFieldSet',
    Root = 'Root',
}

export interface AcuElement {
    Type: AcuElementType;
}