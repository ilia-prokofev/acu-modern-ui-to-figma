export enum AcuElementType {
    Field = 'Field',
    FieldSet = 'FieldSet',
    Template = 'Template',
    Tab = 'Tab',
    Tabbar = 'Tabbar',
    Grid = 'Grid',
    GridColumn = 'GridColumn',
    FieldsetSlot = 'FieldsetSlot',
    Group = 'Group',
    Root = 'Root',
}

export interface AcuElement {
    Type: AcuElementType;
}