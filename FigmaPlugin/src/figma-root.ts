// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
import {
    QPField,
    QPFieldButton,
    QPFieldCheckbox,
    QPFieldElementType,
    QPFieldHorizontalContainer,
    QPFieldLabelValue,
    QPFieldMultilineTextEditor,
    QPFieldRadioButton,
    QPFieldSelector,
    QPFieldStatus
} from "./elements/qp-field";
import {Template} from "./elements/qp-template";
import {QPFieldset} from "./elements/qp-fieldset";
import {AcuElementType} from "./elements/acu-element";
import {FieldsetSlot} from "./elements/qp-fieldset-slot";
import {Tab, TabBar} from "./elements/qp-tabbar";
import {Grid, GridColumnType} from "./elements/qp-grid";
import {Root} from "./elements/qp-root";
import {QPToolBar, QPToolBarItemButton, QPToolBarItemType, QPToolBarType} from "./elements/qp-toolbar";
import {IconType} from "./elements/icon";
import {QPRichTextEditor} from "./elements/qp-rich-text-editor";
import {QPImage} from "./elements/qp-image";
import {QPSplitContainer, QPSplitContainerOrientation, QPSplitPanel} from "./elements/qp-split";
import {QPTree} from "./elements/qp-tree";
import {FigmaNode} from "./figma-node";

const horizontalSpacing = 12;
const verticalSpacing = 12;
const padding = 24;
const screenSpacing = 50
const pageWidth = 1364;//1600;
const pageHeight = 900;
const viewportWidth = pageWidth - 80 - padding * 2;
const viewportHeight = pageHeight - 50;
const devMode = false;

let childrenNumber = 0;
let childrenProcessed = 0;
let progress = 0;
let isCancelled = false;

let compFieldset = undefined as unknown as ComponentNode;
let compHeader = undefined as unknown as ComponentNode;
let compMainHeader = undefined as unknown as ComponentNode;
let compLeftMenu = undefined as unknown as ComponentNode;
let compGrid = undefined as unknown as ComponentNode;
let compTabbar = undefined as unknown as ComponentNode;
let compCheckbox = undefined as unknown as ComponentNode;
let compImageViewer = undefined as unknown as ComponentNode;
let compRichTextEditor = undefined as unknown as ComponentNode;
let compSplitter = undefined as unknown as ComponentNode;
let compTree = undefined as unknown as ComponentNode;
let log: string[] = [];

const buttonIcons = new Map<IconType, string>([
    [IconType.Refresh        , 'c49868efe2dfa88095d9db037824cdd7721ad06e'],
    [IconType.Undo           , '6229695a70dcf7ded45f99f84288ae92b03c7c56'],
    [IconType.Insert         , 'de700daf8268fce0d3acff9011f4a936bf77f714'],
    [IconType.Edit           , 'b9257482b69a7be89190abee18ad34b6d42a9184'],
    [IconType.AdjustColumns  , '83ed0e23748392291c66e9de42c2f6c42a4c634f'],
    [IconType.ExportToExcel  , '54921de81540be32af6fc0af318f2b4937ad32ee'],
    [IconType.Copy           , '7a292951e78c1b33bb1214a62617efaf264cb18e'],
    [IconType.Delete         , '3768bac5ab85ab45fe6abc62eacf515cddddee11'],
    [IconType.First          , '339e24e29430577c293d9826f77fabc48053d077'],
    [IconType.Last           , '7c9aa4dd8f3449ddbdee384b8d348676ed5c2142'],
    [IconType.Back           , 'ff33972c40f4435a4020c8ce300c305f68ac0a84'],
    [IconType.Previous       , 'defe6a35b414086383ab7b4dd627a757e9349b01'],
    [IconType.Next           , 'ac17253deb51f88a538228224f12f5b2bec0b64e'],
    [IconType.Save           , '55688f66ef69a0bf4abc6ac8e48b561f4c08fc4f'],
    [IconType.SaveAndBack    , '7693000f6771b4135a00ad062e3b9b4b718b6ceb'],
    [IconType.Import         , '9bbe97f874029e4de44a1f28f9fa76cd39bfef29'],
    [IconType.Ellipsis       , '19be5dec53338a1bd35ff1f7e409da34d5f1e287'],
    [IconType.AddRow         , 'de700daf8268fce0d3acff9011f4a936bf77f714'],
    [IconType.DeleteRow      , '4eb380b404d2d81e5c704961928388fd224c3964'],
    [IconType.ArrowDown      , '800ef65e596f2ae7e722ca31984f4d649c4ccc63'],
]);
let buttonIconIDs = new Map<IconType, string>();

function SetProperties(instanceNode: InstanceNode, figmaNode: FigmaNode) {
    try {
        instanceNode.setProperties(figmaNode.componentProperties);
    }
    catch (e) {
        Warn((e as Error).message, figmaNode.acuElement?.Id);
    }
}

function Warn(message: string, id: string | null = null, node: any | null = null): void {
    const messageAndID = `${message.replace(/\n/g, '\t')} (id: ${id})`;
    log.push(messageAndID);
    console.warn(messageAndID, node);
}

function Log(message: string): void {
    log.push(message);
    console.log(message);
}

export class figmaRoot extends FigmaNode {
    constructor(root: Root) {
        super('Canvas', 'FRAME');
        this.tryToFind = false;
        this.acuElement = root;

        if (root.ToolBar)
            this.children.push(new figmaToolbar(root.ToolBar));

        for (const fs of root.Children) {
            switch (fs.Type) {
                case AcuElementType.Template:
                    this.children.push(new figmaTemplate(fs as Template));
                    break;
                case AcuElementType.SplitContainer:
                    this.children.push(new figmaSplitContainer(fs as QPSplitContainer));
                    break;
                case AcuElementType.Tabbar:
                    this.children.push(new figmaTabbar(fs as TabBar));
                    break;
                case AcuElementType.Tree:
                    this.children.push(new figmaTree(fs as QPTree));
                    break;
                case AcuElementType.Grid:
                    this.children.push(new figmaGrid(fs as Grid, 'Grid', true));
                    break;
            }
        }
    }
}

async function Draw(field: FigmaNode, parent: InstanceNode | PageNode | GroupNode | FrameNode | ComponentNode, setView = false) {
    if (isCancelled) { stopNow(); return; }
    childrenProcessed++;
    if (childrenProcessed == childrenNumber || childrenProcessed % 10 == 0) {
        progress = Math.floor(childrenProcessed * 90 / childrenNumber) + 10;
        figma.ui.postMessage({type: 'progress', progress});
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    let instance = field.figmaObject;
    if (!instance) {
        if (field.tryToFind) {
            if (field.childIndex >= 0)
                instance = parent.children[field.childIndex] as InstanceNode;
            else
                instance = parent.findOne(node => node.type === field.type && node.name === field.name) as InstanceNode;

            if (!instance && !field.createIfNotFound) {
                Warn(`${field.name} not found`, field.acuElement?.Id, parent);
                return;
            }
        }

        if (!instance) {
            switch (field.type) {
                case 'INSTANCE':
                    instance = field.componentNode!.createInstance() as InstanceNode;
                    break;
                case 'FRAME':
                    instance = figma.createFrame() as FrameNode;
                    instance.layoutMode = field.layoutMode;
                    instance.itemSpacing = field.layoutMode == 'VERTICAL' ? verticalSpacing : horizontalSpacing;
                    break;
            }
            instance.name = field.name;
            parent.appendChild(instance);
        }
    }

    if (field.width > 0 || field.height > 0)
        instance.resize(field.width > 0 ? field.width : instance.width, field.height > 0 ? field.height : instance.height);

    if (instance.type === 'INSTANCE')
        SetProperties(instance, field);

    for (const property in field.properties) {
        // @ts-ignore
        instance[property] = field.properties[property];
    }

    field.figmaObject = instance;

    if (setView)
        figma.viewport.scrollAndZoomIntoView([instance]);

    if (field.detach) {
        instance = (instance as InstanceNode).detachInstance();
        instance.children[1].remove();
    }

    for (const child of field.children)
        await Draw(child, instance);
}

class figmaCheckbox extends FigmaNode{
    constructor(checkbox: QPFieldCheckbox, name: string) {
        super(name, 'INSTANCE');
        this.componentProperties['Value ▶#6695:0'] = checkbox.CheckboxName??'';
        this.componentProperties['Selected'] = checkbox.Checked ? 'True' : 'False';
    }
}

class figmaValue extends FigmaNode{
    constructor(field: QPFieldSelector) {
        super('Field', 'INSTANCE');
        const typedField = field as QPFieldLabelValue;
        this.componentProperties['Text Value ▶#3161:0'] = typedField.Value??'';
        this.componentProperties['State'] = field.ReadOnly == false ? 'Default' : 'Disabled';
    }
}

class figmaRow extends FigmaNode{

    static rowTypes = new Map<QPFieldElementType, string>([
        [QPFieldElementType.Currency    , 'Currency'],
        [QPFieldElementType.CheckBox    , 'Checkbox'],
        [QPFieldElementType.DateTimeEdit, 'Date'],
        [QPFieldElementType.DropDown    , 'Label + Field'],
        [QPFieldElementType.TextEditor  , 'Label + Field'],
        [QPFieldElementType.Selector    , 'Label + Field'],
        [QPFieldElementType.NumberEditor, 'Label + Number Field'],
        [QPFieldElementType.Status      , 'Label + Field'],
        [QPFieldElementType.Button      , 'Button'],
        [QPFieldElementType.RadioButton , 'Radio Button'],
        [QPFieldElementType.MultilineTextEditor, 'Label + Text Area'],
        [QPFieldElementType.HorizontalContainer, 'Label + Field'],
        [QPFieldElementType.LabelFieldCheckbox, 'Label + Field + Checkbox'],
        [QPFieldElementType.LabelFieldButton, 'Label + Field + Button']
    ]);

    constructor(field: QPField, name: string, parent: FigmaNode | null = null) {
        super(name, 'INSTANCE');
        this.acuElement = field;

        if (!field.ElementType) {
            Warn(`Row type can not be null (${field})`, this.acuElement.Id, field);
            return;
        }

        let elementType = field.ElementType;

        if (elementType == QPFieldElementType.HorizontalContainer) {
            const typedField = field as QPFieldHorizontalContainer;
            if (typedField.Children.length == 2) {
                const child1 = typedField.Children[0] as QPField;
                const child2 = typedField.Children[1] as QPField;

                if (child1.ElementType == QPFieldElementType.Selector && child2.ElementType == QPFieldElementType.CheckBox)
                    elementType = QPFieldElementType.LabelFieldCheckbox;
            }
        }

        if (!figmaRow.rowTypes.has(field.ElementType)) {
            Warn(`${field.ElementType} row type is not supported`, this.acuElement.Id, field);
            elementType = QPFieldElementType.TextEditor;
        }
        this.componentProperties['Type'] = figmaRow.rowTypes.get(elementType)!;

        let labelField;
        let valueField;
        let typedField;
        let defaultState = 'Default';

        switch (elementType) {
            case QPFieldElementType.CheckBox:
                typedField = field as QPFieldCheckbox;
                valueField = new figmaCheckbox(typedField, 'Checkbox');
                this.children.push(valueField);
                break;
            case QPFieldElementType.RadioButton:
                this.componentProperties['Label Position'] = 'Top';
                this.componentProperties['Label Length'] = 's';
                typedField = field as QPFieldRadioButton;
                valueField = new FigmaNode('Radiobuttons');
                valueField.componentProperties['Name#8227:0'] = typedField.RadioName??'';
                valueField.componentProperties['Checked'] = typedField.Checked ? 'True' : 'False';
                this.children.push(valueField);
                break;
            case QPFieldElementType.Button:
                typedField = field as QPFieldButton;
                valueField = new FigmaNode('Button');
                valueField.componentProperties['Type'] = 'Secondary';
                valueField.componentProperties['Value ▶#3133:332'] = typedField.Value??'';
                this.children.push(valueField);
                break;
            case QPFieldElementType.MultilineTextEditor:
                typedField = field as QPFieldMultilineTextEditor;
                labelField = new FigmaNode('Label');
                labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label??'';
                this.children.push(labelField);

                valueField = new FigmaNode('Text Area');
                valueField.componentProperties['Text Value ▶#4221:3'] = typedField.Value??'';
                defaultState = 'Normal';
                this.children.push(valueField);
                break;
            case QPFieldElementType.Status:
                typedField = field as QPFieldStatus;
                labelField = new FigmaNode('Label');
                labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label??'';
                this.children.push(labelField);

                valueField = new FigmaNode('Field');
                valueField.componentProperties['Type'] = 'Status';
                this.children.push(valueField);

                const status = new FigmaNode('Status');
                status.componentProperties['Status'] = typedField.Value??'';
                this.children.push(status);
                break;
            case QPFieldElementType.HorizontalContainer:
                let width = 0;
                const itemSpacing = 8;
                const labelWisth = 200;
                if (parent) {
                    parent.detach = true;
                    width = parent.width;
                }
                this.detach = true;
                typedField = field as QPFieldHorizontalContainer;
                const container = new FigmaNode('Container', 'FRAME');
                container.tryToFind = false;
                container.layoutMode = 'HORIZONTAL';
                container.properties['primaryAxisSizingMode'] = 'AUTO';
                container.properties['counterAxisSizingMode'] = 'AUTO';
                container.properties['itemSpacing'] = 0;
                container.properties['layoutGrow'] = 1;
                container.properties['fills'] = [];

                labelField = new FigmaNode('Label');
                labelField.componentProperties['Label Value ▶#3141:62'] = '';
                this.children.push(labelField);
                if (width > 0)
                    width = (width - labelWisth) / typedField.Children.length - itemSpacing;

                this.children.push(container);
                let childNumber = 1;
                for (const childField of typedField.Children) {
                    let newChild;
                    switch ((childField as QPField).ElementType) {
                        case QPFieldElementType.CheckBox:
                            newChild = new figmaCheckbox(childField as QPFieldCheckbox, `Checkbox ${childNumber++}`);
                            break;
                        // case QPFieldElementType.Selector:
                        //     newChild = new figmaCheckbox(childField as QPFieldCheckbox, `Checkbox ${childNumber++}`);
                        //     break;
                        default:
                            continue;
                    }

                    newChild.tryToFind = false;
                    newChild.componentNode = compCheckbox;
                    newChild.width = width;
                    container.children.push(newChild);
                }
                return;
            case QPFieldElementType.LabelFieldCheckbox:
                typedField = field as QPFieldHorizontalContainer;
                labelField = new FigmaNode('Label');
                labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label??'';
                this.children.push(labelField);
                this.children.push(new figmaValue(typedField.Children[0] as QPFieldSelector));
                this.children.push(new figmaCheckbox(typedField.Children[1] as QPFieldCheckbox, 'Checkbox'));
                break;
            case QPFieldElementType.TextEditor:
            case QPFieldElementType.Selector:
            case QPFieldElementType.DropDown:
            case QPFieldElementType.NumberEditor:
            case QPFieldElementType.DateTimeEdit:
            case QPFieldElementType.Currency:
                typedField = field as QPFieldLabelValue;
                labelField = new FigmaNode('Label');
                labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label??'';
                this.children.push(labelField);

                valueField = new FigmaNode('Field');
                valueField.componentProperties['Text Value ▶#3161:0'] = typedField.Value??'';
                if (elementType == QPFieldElementType.DropDown)
                    valueField.componentProperties['Icon#3160:22'] = buttonIconIDs.get(IconType.ArrowDown)!;
                if (elementType == QPFieldElementType.TextEditor)
                    valueField.componentProperties['Show Icon#3160:30'] = false;

                this.children.push(valueField);
                break;
            default:
                Warn(`${elementType} row element type not supported`, this.acuElement.Id, field);
                break;
        }
        if (labelField && !field.ReadOnly && field.Mandatory)
            labelField.componentProperties['Mandatory#3141:16'] = field.Mandatory;
        if (valueField)
            valueField.componentProperties['State'] = field.ReadOnly == false ? defaultState : 'Disabled';

    }
}

class figmaSplitter extends FigmaNode {
    constructor(orientation: QPSplitContainerOrientation) {
        super('Splitter');
        this.tryToFind = false;
        this.componentNode = compSplitter;
        this.width = 16;
        this.properties['rotation'] = orientation == QPSplitContainerOrientation.Horizontal ? 0 : 90;
        this.properties['layoutAlign'] = 'STRETCH';
    }
}

class figmaSplitContainer extends FigmaNode {
    constructor(splitContainer: QPSplitContainer, width = 0) {
        super('SplitContainer', 'FRAME');
        this.layoutMode = splitContainer.Orientation == QPSplitContainerOrientation.Vertical ? 'VERTICAL' : 'HORIZONTAL';
        this.properties['counterAxisSizingMode'] = 'AUTO';
        this.properties['itemSpacing'] = 0;
        this.tryToFind = false;
        this.acuElement = splitContainer;

        const splitterWidth = 16;
        let panelWidth = width == 0 ? viewportWidth : width;
        if (splitContainer.Orientation == QPSplitContainerOrientation.Horizontal)
            panelWidth = (panelWidth - splitterWidth) / 2;

        if (splitContainer.Panel1)
            this.children.push(new figmaSlot(splitContainer.Panel1, panelWidth));
        this.children.push(new figmaSplitter(splitContainer.Orientation));
        if (splitContainer.Panel2)
            this.children.push(new figmaSlot(splitContainer.Panel2, panelWidth));
    }
}

class figmaTree extends FigmaNode {
    constructor(tree: QPTree, width = 0) {
        super('Tree');
        this.tryToFind = false;
        this.acuElement = tree;
        this.componentNode = compTree;
        this.width = width;
        this.componentProperties['Search#7892:1'] = false;

        if (tree.Caption) {
            this.componentProperties['Caption#7892:0'] = true;
            const caption = new FigmaNode('Group Header');
            caption.componentProperties['Text Value ▶#4494:3'] = tree.Caption!;
            this.children.push(caption);
        }
        else
            this.componentProperties['Caption#7892:0'] = false;
    }
}

class figmaImageViewer extends FigmaNode {
    constructor(imageViewer: QPImage, width = 0) {
        super('ImageViewer');
        this.tryToFind = false;
        this.acuElement = imageViewer;
        this.componentNode = compImageViewer;
        this.width = width;
        this.componentProperties['Caption#6303:4'] = false;
    }
}

class figmaRichTextEditor extends FigmaNode {
    constructor(richTextEditor: QPRichTextEditor, width = 0) {
        super('RichTextEditor');
        this.tryToFind = false;
        this.acuElement = richTextEditor;
        this.componentNode = compRichTextEditor;
        this.width = width;
        this.componentProperties['Header#5725:0'] = false;
    }
}

class figmaGrid extends FigmaNode {

    columnTypes = new Map<GridColumnType, string>([
        [GridColumnType.Settings, 'Settings'],
        [GridColumnType.Files   , 'Files'],
        [GridColumnType.Notes   , 'Notes'],
        [GridColumnType.Text    , 'Text'],
        [GridColumnType.Link    , 'Link'],
        [GridColumnType.Checkbox, 'Checkboxes with Text Header']
    ]);

    constructor(grid: Grid, name: string, newInstance: boolean) {
        super(name);
        this.tryToFind = !newInstance;
        this.acuElement = grid;
        this.componentProperties['Wrapped'] = grid.Wrapped ? 'Yes' : 'No';

        if (grid.Caption != null) {
            this.componentProperties['👁 Caption#5610:0'] = true;
            if (grid.Wrapped) {
                const caption = new FigmaNode('Group Header');
                caption.componentProperties['Text Value ▶#4494:3'] = grid.Caption!;
                this.children.push(caption);
            }
            else {
                const caption = new FigmaNode('Caption');
                caption.componentProperties['Text Value ▶#4494:3'] = grid.Caption!;
                this.children.push(caption);
            }
        }

        if (newInstance) {
            this.componentNode = compGrid;
            this.width = viewportWidth;
        }

        this.componentProperties['👁 Header#6826:0'] = true;
        if (grid.Footer) {
            this.componentProperties['👁 Footer#4741:54'] = true;
            const footer = new FigmaNode('Grid Footer');
            footer.componentProperties['Type'] = grid.Footer.FooterType;
            this.children.push(footer);
        }

        let displayedRows = 0;
        const displayedColumns = 13;
        const displayedRowsDefault = 5;
        const displayedRowsMax = 10;
        const displayedColumnsDefault = 10;

        const visibleColumns = Math.min(displayedColumns, grid.Columns.length);

        for (let i = 1; i <= visibleColumns; i++) {
            const column = grid.Columns[i-1];
            displayedRows = Math.max(displayedRows, column.Cells.length);
            if (displayedRows >= displayedRowsMax) {
                displayedRows = displayedRowsMax;
                break;
            }
        }

        if (grid.ToolBar)
            this.children.push(new figmaToolbar(grid.ToolBar));

        let columnNumber = 1;

        for (let i = 1; i <= visibleColumns; i++) {
            const column = grid.Columns[i-1];
            let columnInstance = new FigmaNode(`Grid Column ${columnNumber++}`);

            if (!this.columnTypes.has(column.ColumnType))
                Warn(`${this.columnTypes} column type is not supported`, this.acuElement.Id, this);
            else
                columnInstance.componentProperties['Type'] = this.columnTypes.get(column.ColumnType)!;

            columnInstance.properties['visible'] = true;
            columnInstance.properties['counterAxisSizingMode'] = 'AUTO';

            if (column.ColumnType == GridColumnType.Settings ||
                column.ColumnType == GridColumnType.Notes ||
                column.ColumnType == GridColumnType.Files)
                columnInstance.properties['layoutGrow'] = 0;
            else
                columnInstance.properties['layoutGrow'] = 1;

            if (column.ColumnType == GridColumnType.Settings)
                continue;

            columnInstance.componentProperties['Alignment'] = (column.Alignment == 'Right' ? 'Right' : 'Left');
            this.children.push(columnInstance);

            for (let j = displayedRowsDefault; j < displayedRows; j++) {
                const cell = new FigmaNode(`Cell ${j+1}`);
                cell.childIndex = j + 1;
                cell.componentProperties['Show Value#4709:42'] = true;
                columnInstance.children.push(cell);
            }

            for (let j = displayedRows; j < displayedRowsDefault; j++) {
                const cell = new FigmaNode(`Cell ${j+1}`);
                cell.childIndex = j + 1;
                cell.componentProperties['Show Value#4709:42'] = false;
                columnInstance.children.push(cell);
            }

            if (column.ColumnType == GridColumnType.Notes || column.ColumnType == GridColumnType.Files)
                continue;

            const header = new FigmaNode('Column Header');
            header.childIndex = 0;
            header.componentProperties['Value#6706:49'] = column.Label;
            columnInstance.children.push(header);

            for (let j = 0; j < column.Cells.length; j++) {
                const cell = new FigmaNode(`Cell ${j+1}`);
                cell.childIndex = j + 1;
                if (column.ColumnType == GridColumnType.Checkbox) {
                    if (column.Cells[j] == 'true') {
                        const checkbox = new FigmaNode(`Checkbox Indicator`);
                        checkbox.componentProperties['Selected'] = true;
                        cell.children.push(checkbox);
                    }
                }
                else
                    cell.componentProperties['Value#6706:0'] = column.Cells[j];
                columnInstance.children.push(cell);
            }

            for (let j = column.Cells.length; j < displayedRows; j++) {
                const cell = new FigmaNode(`Cell ${j+1}`);
                cell.childIndex = j + 1;
                cell.componentProperties['Value#6706:0'] = '';
                columnInstance.children.push(cell);
            }
        }

        for (let i = columnNumber; i <= displayedColumnsDefault; i++) {
            const gridColumn = new FigmaNode(`Grid Column ${i}`);
            gridColumn.properties['visible'] = false;
            this.children.push(gridColumn);
        }

        if (columnNumber > 10) {
            const gridColumn = new FigmaNode(`Grid Column 20`);
            gridColumn.properties['visible'] = false;
            this.children.push(gridColumn);
        }
    }
}

class figmaToolbar extends FigmaNode {

    toolBarTypes = new Map<QPToolBarType, string>([
        [QPToolBarType.List     , 'List'],
        [QPToolBarType.Record   , 'Record'],
        [QPToolBarType.FilterBar, 'Filter bar']
    ]);

    filterBarMapping = new Map<string, number>([
        ['FilterCombo1' , 0],
        ['Separator1'   , 1],
        ['FilterButton1', 2],
        ['FilterButton2', 3],
        ['FilterButton3', 4],
        ['Button1'      , 5],
        ['Button2'      , 6],
        ['Button3'      , 7]
    ])

    constructor(toolbar: QPToolBar) {
        super('Toolbar');
        this.acuElement = toolbar;

        const displayedButtonsMax = toolbar.ToolBarType == 'Record' ? 15 : 11;
        if (this.toolBarTypes.has(toolbar.ToolBarType))
            this.componentProperties['Type'] = this.toolBarTypes.get(toolbar.ToolBarType)!;
        this.componentProperties['Show Right Actions#6826:45'] = toolbar.ShowRightAction;

        if (toolbar.ToolBarType == QPToolBarType.FilterBar) {
            // console.log(111);
            // for (const toolbarItem of toolbar.Items) {
            //     console.log(toolbarItem.ItemType, this.filterBarMapping.get(toolbarItem.ItemType + 1));
            // }
            // console.log(222);
            return;
        }

        const buttons = new FigmaNode('Buttons');
        buttons.childIndex = 0;
        this.children.push(buttons);

        for (let i = 0; i < displayedButtonsMax; i++) {
            const button = new FigmaNode('Button');
            button.childIndex = i;
            buttons.children.push(button);

            if (i >= toolbar.Items.length) {
                button.properties['visible'] = false;
            }
            else {
                const item = toolbar.Items[i];
                button.properties['visible'] = true;
                if (item.ItemType != QPToolBarItemType.Button) continue;
                const buttonItem = item as QPToolBarItemButton;

                button.componentProperties['Type'] = buttonItem.Style;
                button.componentProperties['State'] = buttonItem.Enabled ? 'Default' : 'Disabled';

                const icon = buttonItem.Icon;
                button.componentProperties['Show Icon Left#3133:110'] = icon != null;
                if (icon) {
                    if (!buttonIconIDs.has(icon))
                        Warn(`${icon} icon is not supported`, this.acuElement.Id);
                    else
                        button.componentProperties['Icon Left#3131:0'] = buttonIconIDs.get(icon)!;
                }
                const text = buttonItem.Text;
                button.componentProperties['Show Label#3133:443'] = text != null;
                if (text)
                    button.componentProperties['Value ▶#3133:332'] = text;
                //button.componentProperties['Show Icon Right#3133:221'] = false;
            }

        }
    }
}

class figmaTabbar extends FigmaNode {
    constructor(tabBar: TabBar, width = 0) {
        super('Tabbar', 'FRAME', width == 0 ? viewportWidth : width);
        this.tryToFind = false;
        this.acuElement = tabBar;

        const tabs = new FigmaNode('Tabs');
        tabs.tryToFind = false;
        tabs.componentNode = compTabbar;

        const maxTabsCount = 13;

        for (let i = 0; i < maxTabsCount; i++) {
            const propertyName = `${i+1} tab#6936:${i}`;
            tabs.componentProperties[propertyName] = i + 1 <= tabBar.Tabs.length;
        }

        for (let i = 0; i < Math.min(tabBar.Tabs.length, maxTabsCount); i++) {
            const tab = (tabBar.Tabs[i] as unknown) as Tab;
            const figmaTab = new FigmaNode(`Tab ${i+1}`);
            figmaTab.componentProperties['State'] = 'Normal';
            figmaTab.componentProperties['Value ▶#3265:0'] = tab.Label;
            figmaTab.componentProperties['Selected'] = tab.IsActive ? 'True' : 'False';
            tabs.children.push(figmaTab);
        }

        this.children.push(tabs);

        tabBar.Children.forEach(fs => {
            switch (fs.Type) {
                case AcuElementType.Template: {
                    this.children.push(new figmaTemplate(fs as Template, width));
                    break;
                }
                case AcuElementType.Tree:
                    this.children.push(new figmaTree(fs as QPTree, width));
                    break;
                case AcuElementType.Grid: {
                    const grid = new figmaGrid((fs as unknown) as Grid, 'Grid', true);
                    grid.width = width;
                    this.children.push(grid);
                    break;
                }
                case AcuElementType.SplitContainer: {
                    this.children.push(new figmaSplitContainer(fs as QPSplitContainer, viewportWidth));
                    break;
                }
            }
        });
    }
}

class figmaTemplate extends FigmaNode {
    constructor(template: Template, width = 0) {
        super('Template', 'FRAME', width == 0 ? viewportWidth : width);
        this.tryToFind = false;
        this.acuElement = template;
        this.layoutMode = 'HORIZONTAL';
        this.properties['counterAxisSizingMode'] = 'AUTO';
        if (template.Children.length == 0)
            this.properties['visible'] = false;

        let proportionalWidth = (this.width - (horizontalSpacing * (template.Children.length - 1))) / template.Children.length;
        const parts = template.Name?.split('-').map(p => parseInt(p)) ?? [];
        let sum = 0;
        parts?.forEach((part, i) => {
            sum += part;
        })

        template.Children.forEach((fs, i) => {
            let slotWidth = proportionalWidth;
            if (sum > 0)
                slotWidth = (this.width - (horizontalSpacing * (template.Children.length - 1))) * parts[i] / sum;
            switch (fs.Type) {
                case AcuElementType.FieldSet:
                    this.children.push(new figmaFieldSet(fs as QPFieldset, slotWidth));
                    break;
                case AcuElementType.FieldsetSlot:
                    this.children.push(new figmaSlot(fs as FieldsetSlot, slotWidth));
                    break;
                case AcuElementType.Image:
                    this.children.push(new figmaImageViewer(fs as QPImage, slotWidth));
                    break;
                case AcuElementType.RichTextEditor:
                    this.children.push(new figmaRichTextEditor(fs as QPRichTextEditor, slotWidth));
                    break;
                case AcuElementType.Tree:
                    this.children.push(new figmaTree(fs as QPTree, slotWidth));
                    break;
                case AcuElementType.Grid:
                    const grid = new figmaGrid(fs as Grid, 'Grid', true);
                    grid.properties['layoutAlign'] = 'STRETCH';
                    grid.height = 250;
                    grid.width = slotWidth;
                    this.children.push(grid);
                    break;
            }
        });
    }
}

class figmaSlot extends FigmaNode {
    constructor(slot: FieldsetSlot | QPSplitPanel, width = 0) {
        super('slot', 'FRAME', width);
        this.tryToFind = false;
        this.acuElement = slot;

        slot.Children.forEach(fs => {
            switch (fs.Type) {
                case AcuElementType.Template:
                    this.children.push(new figmaTemplate(fs as Template, width));
                    break;
                case AcuElementType.SplitContainer:
                    this.children.push(new figmaSplitContainer(fs as QPSplitContainer, width));
                    break;
                case AcuElementType.Tabbar:
                    this.children.push(new figmaTabbar(fs as TabBar, width));
                    break;
                case AcuElementType.FieldSet:
                    this.children.push(new figmaFieldSet(fs as QPFieldset, width));
                    break;
                case AcuElementType.Image:
                    this.children.push(new figmaImageViewer(fs as QPImage, width));
                    break;
                case AcuElementType.RichTextEditor:
                    this.children.push(new figmaRichTextEditor(fs as QPRichTextEditor, width));
                    break;
                case AcuElementType.Tree:
                    this.children.push(new figmaTree(fs as QPTree, width));
                    break;
                case AcuElementType.Grid:
                    const grid = new figmaGrid(fs as Grid, 'Grid', true);
                    grid.properties['layoutAlign'] = 'STRETCH';
                    grid.height = 250;
                    this.children.push(grid);
                    break;
            }
        });
    }
}

class figmaFieldSet extends FigmaNode{

    static showRowPropNames = [
        'Show Row 1#5419:15',
        'Show Row 2#5419:17',
        'Show Row 3#5419:19',
        'Show Row 4#5419:13',
        'Show Row 5#5419:11',
        'Show Row 6#5419:9',
        'Show Row 7#5419:8',
        'Show Row 8#5419:7',
        'Show Row 9#5419:5',
        'Show Row 10#5419:12',
        'Show Row 11#5419:10',
        'Show Row 12#5419:3',
        'Show Row 13#5419:2',
        'Show Row 14#5419:6',
        'Show Row 15#5419:4',
        'Show Row 16#5419:16',
        'Show Row 17#5419:18',
        'Show Row 18#5419:1',
        'Show Row 19#5419:0',
        'Show Row 20#5419:14'
    ];

    constructor(fs: QPFieldset, width = 0){
        super('FieldSet', 'INSTANCE', width);
        this.tryToFind = false;
        this.componentNode = compFieldset;
        this.acuElement = fs;

        const showHeader = (fs.Label != '' && fs.Label != null)
        this.componentProperties['Show Group Header#6619:0'] = showHeader;
        if (showHeader) {
            let child = new FigmaNode('Group Header');
            child.componentProperties['Text Value ▶#4494:3'] = fs.Label??'';
            this.children.push(child);
        }

        this.componentProperties['Wrapping'] = fs.Style;

        let rowNumber = 0;
        for (const child of fs.Children) {
            if (child.Type == AcuElementType.Grid) {
                this.componentProperties['Show grid#5425:0'] = true;
                this.children.push(new figmaGrid(child as unknown as Grid, 'Grid', false));
            }
            else
                this.children.push(new figmaRow(child as QPField, `Row ${++rowNumber}`, this));
        }

        for (let i = 0; i < figmaFieldSet.showRowPropNames.length; i++)
            this.componentProperties[figmaFieldSet.showRowPropNames[i]] = (rowNumber > i);

    }
}

export async function DrawFromJSON(input: string, reuseSummary: boolean) {

    if (input === '')
        return;

    let root;
    try {
        root = JSON.parse(input) as Root;
    }
    catch (ex) {
        Warn(ex as string);
        return;
    }

    const rootItem = new figmaRoot(root);
    console.log(rootItem);
    childrenNumber = countChildren(rootItem);

    let screenName = root.Title??'Screen';
    let drawSummaryComponent = false;
    let summary;
    let compSummary;

    if (rootItem.children.length >= 2 &&
        rootItem.children[rootItem.children.length - 2].acuElement?.Type == AcuElementType.Template &&
        rootItem.children[rootItem.children.length - 1].acuElement?.Type == AcuElementType.Tabbar)
    {
        summary = rootItem.children[rootItem.children.length - 2];
        setSummaryStretching(summary);

        if (reuseSummary) {

            let workPage;
            if (devMode) {
                workPage = figma.root.children.find(p => p.name === screenName);
                if (!workPage) {
                    workPage = figma.createPage();
                    workPage.name = screenName;
                }
            }
            else
                workPage = figma.currentPage;

            const libPageName = 'Component Library';
            let libPage = figma.root.children.find(p => p.name === libPageName);
            if (!libPage) {
                libPage = figma.createPage();
                libPage.name = libPageName;
            }

            const componentName = `${screenName} Summary`;
            compSummary = libPage.children.find(n => n.type === 'COMPONENT' &&  n.name === componentName) as ComponentNode;

            if (!compSummary) {
                await figma.setCurrentPageAsync(libPage);
                const componentGap = 100;
                let componentY = 0;
                for (const child of libPage.children) {
                    if (child.y + child.height + componentGap > componentY)
                        componentY = child.y + child.height + componentGap;
                }

                compSummary = figma.createComponent();
                compSummary.y = componentY;
                compSummary.layoutMode = 'HORIZONTAL';
                compSummary.primaryAxisSizingMode = 'AUTO';
                compSummary.counterAxisSizingMode = 'AUTO';
                compSummary.name = componentName;
                summary.name = componentName;

                drawSummaryComponent = true;
            }

            let tabName = 'undefined';
            const tabBar = rootItem.children[rootItem.children.length - 1].acuElement as TabBar;
            tabBar.Tabs.forEach((tab) => {
                if (tab.IsActive)
                    tabName = tab.Label;
            })

            screenName = `${screenName} - ${tabName}`;

            await figma.setCurrentPageAsync(workPage);
            const summaryNode = new FigmaNode('Summary', 'INSTANCE')
            summaryNode.tryToFind = false;
            summaryNode.componentNode = compSummary;

            rootItem.children[rootItem.children.length - 2] = summaryNode;
            if (!drawSummaryComponent)
                childrenNumber = countChildren(rootItem);
        }
    }

    progress = 10;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20));

    const frameCanvas = await CreateCanvas(screenName, root.Caption??root.Title, root.Caption == null ? null : root.Title);
    if (!frameCanvas.figmaObject) return;

    if (drawSummaryComponent)
        await Draw(summary as FigmaNode, compSummary!);

    rootItem.figmaObject = frameCanvas.figmaObject;
    await Draw(rootItem as FigmaNode, frameCanvas.figmaObject);
    frameCanvas.figmaObject.primaryAxisSizingMode = "AUTO";

    const lastItem = getLastItem(rootItem);
    if (lastItem.acuElement?.Type == AcuElementType.Grid &&
        frameCanvas.figmaObject.height > viewportHeight) {
        const grid = lastItem.figmaObject;
        if (grid) {
            let newGridHeight = Math.max(250, grid.height - frameCanvas.figmaObject.height + viewportHeight);
            grid.resize(grid.width, newGridHeight);
        }
    }

}

async function CreateCanvas(screenName: string, screenTitle: string|null, backLink: string|null) {

    const frameScreenVertical  = new FigmaNode(screenName, 'FRAME', pageWidth, pageHeight);
    frameScreenVertical.tryToFind = false;
    frameScreenVertical.properties['itemSpacing'] = 0;
    frameScreenVertical.properties['primaryAxisSizingMode'] = 'AUTO';

    let rootItem;
    if (devMode) {
        const frameList = new FigmaNode('List', 'FRAME');
        frameList.createIfNotFound = true;
        frameList.properties['itemSpacing'] = screenSpacing;
        frameList.properties['fills'] = [];
        rootItem = frameList;
        rootItem.children.push(frameScreenVertical);
    } else {
        rootItem = frameScreenVertical;
        const gap = 100;
        let newScreenY = 0;
        for (const child of figma.currentPage.children) {
            if (child.y + child.height + gap > newScreenY)
                newScreenY = child.y + child.height + gap;
        }
        frameScreenVertical.properties['y'] = newScreenY;
    }

    const fieldMainHeader = new FigmaNode('MainHeader', 'INSTANCE', pageWidth);
    fieldMainHeader.tryToFind = false;
    fieldMainHeader.componentNode = compMainHeader;
    frameScreenVertical.children.push(fieldMainHeader);

    const frameScreenHorizontal  = new FigmaNode('FrameH', 'FRAME', pageWidth);
    frameScreenHorizontal.tryToFind = false;
    frameScreenHorizontal.properties['primaryAxisSizingMode'] = 'FIXED';
    frameScreenHorizontal.properties['counterAxisSizingMode'] = 'AUTO';
    frameScreenHorizontal.properties['layoutMode'] = 'HORIZONTAL';
    frameScreenHorizontal.properties['itemSpacing'] = 0;
    frameScreenVertical.children.push(frameScreenHorizontal);

    const fieldLeftMenu = new FigmaNode('LeftMenu', 'INSTANCE');
    fieldLeftMenu.tryToFind = false;
    fieldLeftMenu.componentNode = compLeftMenu;
    fieldLeftMenu.properties['layoutAlign'] = 'STRETCH';
    frameScreenHorizontal.children.push(fieldLeftMenu);

    const frameCanvas  = new FigmaNode('Canvas', 'FRAME', pageWidth - compLeftMenu.width);
    frameCanvas.tryToFind = false;
    frameCanvas.properties['counterAxisSizingMode'] = 'FIXED';
    frameCanvas.properties['itemSpacing'] = verticalSpacing;
    frameCanvas.properties['paddingLeft'] = padding;
    frameCanvas.properties['paddingRight'] = padding;
    frameCanvas.properties['paddingBottom'] = padding;
    frameScreenHorizontal.children.push(frameCanvas);

    const fieldHeader = new FigmaNode('Header', 'INSTANCE', viewportWidth);
    fieldHeader.tryToFind = false;
    fieldHeader.componentNode = compHeader;
    fieldHeader.componentProperties['Show Back Link#3139:0'] = backLink != null;
    fieldHeader.componentProperties['Link Value ▶#6711:0'] = backLink??'';
    fieldHeader.componentProperties['Title Value ▶#6711:8'] = screenTitle??'';
    frameCanvas.children.push(fieldHeader);

    childrenNumber += countChildren(rootItem);

    await Draw(rootItem, figma.currentPage, true);

    return frameCanvas;
}

function countChildren(root: figmaRoot){
    let count = 1;
    for (const child of root.children) {
        count += countChildren(child);
    }
    return count;
}

function setSummaryStretching(root: FigmaNode){
    if (root.acuElement?.Type == AcuElementType.FieldSet) {
        root.properties['primaryAxisSizingMode'] = 'FIXED';
        root.properties['layoutAlign'] = 'STRETCH';
    }
    for (const child of root.children) {
        setSummaryStretching(child);
    }
}

function getLastItem(root: figmaRoot){
    if (root.children.length == 0)
        return root;
    else {
        const lastChild = root.children[root.children.length - 1];
        if (!lastChild.acuElement)
            return root;
        return getLastItem(lastChild);
    }
}

function stopNow() {
    figma.ui.postMessage({ type: 'unlock' });
    childrenNumber = 0;
    childrenProcessed = 0;
    progress = 0;
    figma.ui.postMessage({ type: 'progress', progress });
}

export async function processScreen(input: string, format: string, reuseSummary: boolean) {
    if (format === 'cancel') {
        isCancelled = true;
        Log('Canceled');
        figma.ui.postMessage({ type: 'log', log: log.join('\n') });
        stopNow();
        return;
    }

    log = [];
    figma.ui.postMessage({ type: 'log', log: log.join('\n') });
    isCancelled = false;
    const startTime = Date.now();
    progress = 5;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20));

    await figma.loadAllPagesAsync();

    // Test
    // csFieldset = await figma.importComponentSetByKeyAsync('65edf1d775107cc11081226f698821a462c6edc2');
    // csHeader = await figma.importComponentSetByKeyAsync('80265c2d8ad685491923b57b91c64b3e0989a943');
    // csMainHeader = await figma.importComponentSetByKeyAsync('2f11715b6ef9f03dad26d0c30e330fa824c18e96');
    // cGrid = await figma.importComponentSetByKeyAsync('d6ed7417ddbc12fb781ef5a69d497ef543b5b1bf');
    // cLeftMenu = await figma.importComponentByKeyAsync('790c900390c36c1d7dd582d34f12e1e9ed4c8866');
    // cTabbar = await figma.importComponentByKeyAsync('6908d5b76e824d2a677a35490265b9d64efb3606');

    // Prod
    compFieldset       = (await figma.importComponentSetByKeyAsync('3738d3cfa01194fc3cfe855bf127daa66b21e39e')).defaultVariant;
    compHeader         = (await figma.importComponentSetByKeyAsync('6bf3d7f22449e758cc2b697dd7d80ad7a2d3c21a')).defaultVariant;
    compMainHeader     = (await figma.importComponentSetByKeyAsync('95717954e19e7929d19b33f7bcd03f16e8e1a51b')).defaultVariant;
    compGrid           = (await figma.importComponentSetByKeyAsync('b6b4901b43589a4e2e738087122069e2df254b8f')).defaultVariant;
    compCheckbox       = (await figma.importComponentSetByKeyAsync('4b4affdd12a4320b054701445e4c34aa95af7198')).defaultVariant;
    compImageViewer    = (await figma.importComponentSetByKeyAsync('ba08cb51bc3ad778dc9221d76aaa1baaf1f6ae7b')).defaultVariant;
    compRichTextEditor = (await figma.importComponentSetByKeyAsync('cb542d6b221cd1cb4302529415ff7bb4a135eb67')).defaultVariant;
    compSplitter       = (await figma.importComponentSetByKeyAsync('c671076454c35e10bb86f1ef18936e7953cec793')).defaultVariant;
    compLeftMenu       = await figma.importComponentByKeyAsync('5b4ee7b5f881aa8f6e64f128f4cceef050357378');
    compTabbar         = await figma.importComponentByKeyAsync('e4b7a83b5e34cee8565ad8079b4932764b45dae4');
    compTree           = await figma.importComponentByKeyAsync('ae9880fe4ddbd5f4c7e2784492b78b12ba47c14a');

    for (const [iconType, componentKey] of buttonIcons) {
        const icon = await figma.importComponentByKeyAsync(componentKey);
        buttonIconIDs.set(iconType, icon.id);
    }

    if (format === 'json')
        await DrawFromJSON(input, reuseSummary);

    const endTime = Date.now();
    Log(`Completed in ${Math.floor((endTime - startTime) / 1000)}s`);
    figma.ui.postMessage({ type: 'log', log: log.join('\n') });

    stopNow();
}