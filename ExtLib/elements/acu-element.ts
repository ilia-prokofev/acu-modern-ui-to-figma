export enum AcuElementType {
    Field = 'Field',
    FieldSet = 'FieldSet',
    Template = 'Template',
    Tab = 'Tab',
    Tabbar = 'Tabbar',
    Grid = 'Grid',
    GridColumn = 'GridColumn',
    FieldsetSlot = 'FieldsetSlot',
    Root = 'Root',
    ToolBar = 'ToolBar',
}

export interface AcuElement {
    Type: AcuElementType;
    Id: string;
}