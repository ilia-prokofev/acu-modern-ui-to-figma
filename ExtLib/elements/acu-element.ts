export enum AcuElementType {
    Field = 'Field',
    FieldSet = 'FieldSet',
    Template = 'Template',
    Tabbar = 'Tabbar',
    Grid = 'Grid',
    FieldsetSlot = 'FieldsetSlot',
    Group = 'Group',
    Root = 'Root',
}

export interface AcuElement {
    Type: AcuElementType;
}