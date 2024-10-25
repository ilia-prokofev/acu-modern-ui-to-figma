export enum AcuElementType {
    QPTemplate = 'QPTemplate',
    QPFieldSetSlot = 'QPFieldSetSlot',
    QPField = 'QPField',
    QPFieldSet = 'QPFieldSet',
    Root = 'Root',
}

export interface AcuElement {
    Type: AcuElementType;
}