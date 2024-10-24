export enum AcuElementType {
    QPField = 'QPField',
    QPFieldSet = 'QPFieldSet',
    Root = 'Root',
}

export default interface AcuElement {
    Type: AcuElementType;
}
