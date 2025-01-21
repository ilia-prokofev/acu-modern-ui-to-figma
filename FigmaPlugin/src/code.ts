// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
import {QPField, QPFieldElementType} from "./elements/qp-field";
import {Template} from "./elements/qp-template";
import {QPFieldset} from "./elements/qp-fieldset";
import {AcuElementType} from "./elements/acu-element";
import {FieldsetSlot} from "./elements/qp-fieldset-slot";
import {Tab, TabBar} from "./elements/qp-tabbar";
import {Grid, GridColumnType} from "./elements/qp-grid";
import {Root} from "./elements/qp-root";

figma.showUI(__html__, {width: 650, height: 410});

const horizontalSpacing = 20;
const verticalSpacing = 20;
const pageWidth = 1536;
const pageHeight = 864;
const viewportWidth = pageWidth - 100;

let childrenNumber = 0;
let childrenProcessed = 0;
let progress = 0;

let compFieldset = undefined as unknown as ComponentNode;
let compHeader = undefined as unknown as ComponentNode;
let compMainHeader = undefined as unknown as ComponentNode;
let compLeftMenu = undefined as unknown as ComponentNode;
let compGrid = undefined as unknown as ComponentNode;
let compTabbar = undefined as unknown as ComponentNode;

function SetProperties(node: InstanceNode, properties: any) {
    try {
        node.setProperties(properties);
    }
    catch (e) {
        console.error(node.name, e);
    }
}

type figmaFieldTypes = 'NEW INSTANCE' | 'EXISTING INSTANCE' | 'FRAME';
type figmaLayoutMode = 'NONE' | 'HORIZONTAL' | 'VERTICAL'

async function Draw(field: figmaField, parent: InstanceNode | PageNode | GroupNode | FrameNode) {
    childrenProcessed++;
    const newProgress = Math.floor(childrenProcessed * 95 / childrenNumber) + 5;
    if (newProgress == 100 || newProgress - progress >= 10) {
        progress = newProgress;
        figma.ui.postMessage({type: 'progress', progress});
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    let instance;
    switch (field.type) {
        case 'EXISTING INSTANCE':
            if (field.childNumber >= 0)
                instance = parent.children[field.childNumber] as InstanceNode;
            else {
                instance = parent.findOne(node => node.type === 'INSTANCE' && node.name === field.name) as InstanceNode;
            }
            if (!instance) {
                console.warn(`${field.name} not found`);
                return;
            }
            SetProperties(instance, field.properties);
            if (field.visible != null)
                instance.visible = field.visible;
            break;
        case 'NEW INSTANCE':
            instance = field.componentNode!.createInstance() as InstanceNode;
            if (field.width > 0)
                instance.resize(field.width, instance.height);
            instance.name = field.name;
            SetProperties(instance, field.properties);
            parent.appendChild(instance);
            break;
        case 'FRAME':
            instance = figma.createFrame() as FrameNode;
            instance.layoutMode = field.layoutMode;
            instance.primaryAxisSizingMode = 'AUTO';
            instance.counterAxisSizingMode = 'AUTO';
            instance.itemSpacing = field.layoutMode == 'VERTICAL' ? verticalSpacing : horizontalSpacing;
            instance.name = field.name;
            parent.appendChild(instance);
            break;
    }

    for (const child of field.children)
        await Draw(child, instance);
}


class figmaField {

    name: string;
    height = 0;
    width = 0;
    properties: { [propertyName: string]: string | boolean; } = {};
    children: figmaField[] = [];
    type: figmaFieldTypes;
    componentNode: ComponentNode | null = null;
    layoutMode: figmaLayoutMode = 'VERTICAL';
    visible: boolean | null = null;
    childNumber: number = -1;

    constructor(name: string, type: figmaFieldTypes = 'EXISTING INSTANCE', width = 0, height = 0) {
        this.name = name;
        this.type = type;
        this.width = width;
        this.height = height;
    }

}

class figmaRow extends figmaField{

    typePropertyName = 'Type';
    rowTypes = new Map<QPFieldElementType, string>([
        [QPFieldElementType.Currency    , 'Currency'],
        [QPFieldElementType.CheckBox    , 'Checkbox'],
        [QPFieldElementType.DatetimeEdit, 'Label + Field'],
        [QPFieldElementType.DropDown    , 'Label + Field'],
        [QPFieldElementType.TextEditor  , 'Label + Field'],
        [QPFieldElementType.Selector    , 'Label + Field'],
        [QPFieldElementType.NumberEditor, 'Label + Field'],
        [QPFieldElementType.Status      , 'Label + Field'],
        [QPFieldElementType.Button      , 'Button'],
        [QPFieldElementType.RadioButton , 'Radio Button'],
        [QPFieldElementType.MultilineTextEditor, 'Label + Text Area']
    ]);

    constructor(field: QPField, name: string) {
        super(name, 'EXISTING INSTANCE');

        if (!field.ElementType) {
            console.error(`Row type can not be null`);
            return;
        }

        let elementType = field.ElementType;

        if (!this.rowTypes.has(field.ElementType)) {
            console.error(`${field.ElementType} row type is not supported`);
            elementType = QPFieldElementType.TextEditor;
        }
        this.properties[this.typePropertyName] = this.rowTypes.get(elementType)!;

        let child;

        switch (elementType) {
            case QPFieldElementType.CheckBox:
                child = new figmaField('Checkbox');
                child.properties['Value ▶#6695:0'] = field.Label??'';
                child.properties['Selected'] = field.Value == 'on' ? 'True' : 'False';
                if (field.ReadOnly)
                    child.properties['State'] = 'Disabled';
                this.children.push(child);
                break;
            case QPFieldElementType.RadioButton:
                child = new figmaField('Radiobuttons');
                child.properties['Name#8227:0'] = field.Label??'';
                child.properties['Checked'] = field.Value == 'on' ? 'True' : 'False';
                if (field.ReadOnly)
                    child.properties['State'] = 'Disabled';
                this.children.push(child);
                break;
            case QPFieldElementType.MultilineTextEditor:
                child = new figmaField('Label');
                child.properties['Label Value ▶#3141:62'] = field.Label??'';
                this.children.push(child);

                child = new figmaField('Text Area');
                child.properties['Text Value ▶#4221:3'] = field.Value??'';
                if (field.ReadOnly)
                    child.properties['State'] = 'Disabled';
                this.children.push(child);
                break;
            case QPFieldElementType.Status:
                child = new figmaField('Label');
                child.properties['Label Value ▶#3141:62'] = field.Label??'';
                this.children.push(child);

                child = new figmaField('Field');
                child.properties['Type'] = 'Status';
                if (field.ReadOnly)
                    child.properties['State'] = 'Disabled';
                this.children.push(child);

                child = new figmaField('Status');
                child.properties['Status'] = field.Value??'';
                this.children.push(child);
                break;
            default:
                child = new figmaField('Label');
                child.properties['Label Value ▶#3141:62'] = field.Label??'';
                this.children.push(child);
                child = new figmaField('Field');
                child.properties['Text Value ▶#3161:0'] = field.Value??'';
                if (field.ReadOnly)
                    child.properties['State'] = 'Disabled';
                this.children.push(child);
                break;
        }
    }

}

class figmaGrid extends figmaField {

    columnTypes = new Map<GridColumnType, string>([
        [GridColumnType.Settings, 'Settings'],
        [GridColumnType.Files   , 'Files'],
        [GridColumnType.Notes   , 'Notes'],
        [GridColumnType.Text    , 'Text'],
        [GridColumnType.Link    , 'Link'],
        [GridColumnType.Checkbox, 'Checkboxes with Text Header']
    ]);

    constructor(grid: Grid, name: string, newInstance: boolean) {
        super(name, newInstance ? 'NEW INSTANCE' : 'EXISTING INSTANCE');
        if (newInstance) {
            this.componentNode = compGrid;
            this.width = viewportWidth;
            this.properties['👁 Header#6826:0'] = true;
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

        for (let i = 1; i <= visibleColumns; i++) {
            const column = grid.Columns[i-1];
            const columnInstance = new figmaField(`Grid Column ${i}`);
            columnInstance.visible = true;

            if (!this.columnTypes.has(column.ColumnType))
                console.error(`${this.columnTypes} column type is not supported`);
            else
                columnInstance.properties['Type'] = this.columnTypes.get(column.ColumnType)!;

            if (column.Alignment == 'Right')
                columnInstance.properties['Alignment'] = 'Right';
            this.children.push(columnInstance);

            for (let j = displayedRows; j < displayedRowsDefault; j++) {
                const cell = new figmaField(`Cell ${j+1}`, 'EXISTING INSTANCE');
                cell.childNumber = j + 1;
                cell.properties['Show Value#4709:42'] = false;
                columnInstance.children.push(cell);
            }

            if (column.ColumnType != GridColumnType.Settings)
                for (let j = displayedRowsDefault; j < displayedRows; j++) {
                    const cell = new figmaField(`Cell ${j+1}`, 'EXISTING INSTANCE');
                    cell.childNumber = j + 1;
                    cell.properties['Show Value#4709:42'] = true;
                    columnInstance.children.push(cell);
                }

            if (column.ColumnType == GridColumnType.Settings ||
                column.ColumnType == GridColumnType.Files ||
                column.ColumnType == GridColumnType.Notes) continue;

            const header = new figmaField('Column Header', 'EXISTING INSTANCE');
            header.childNumber = 0;
            header.properties['Value#6706:49'] = column.Label;
            columnInstance.children.push(header);

            for (let j = 0; j < column.Cells.length; j++) {
                const cell = new figmaField(`Cell ${j+1}`, 'EXISTING INSTANCE');
                cell.childNumber = j + 1;
                if (column.ColumnType == GridColumnType.Checkbox) {
                    if (column.Cells[j] == 'true') {
                        const checkbox = new figmaField(`Checkbox Indicator`, 'EXISTING INSTANCE');
                        checkbox.properties['Selected'] = true;
                        cell.children.push(checkbox);
                    }
                }
                else
                    cell.properties['Value#6706:0'] = column.Cells[j];
                columnInstance.children.push(cell);
            }

            for (let j = column.Cells.length; j < displayedRows; j++) {
                const cell = new figmaField(`Cell ${j+1}`, 'EXISTING INSTANCE');
                cell.childNumber = j + 1;
                cell.properties['Value#6706:0'] = '';
                columnInstance.children.push(cell);
            }
        }

        for (let i = visibleColumns + 1; i <= displayedColumnsDefault; i++) {
            const gridColumn = new figmaField(`Grid Column ${i}`, 'EXISTING INSTANCE');
            gridColumn.visible = false;
            this.children.push(gridColumn);
        }

        const gridColumn = new figmaField(`Grid Column 20`, 'EXISTING INSTANCE');
        gridColumn.visible = false;
        this.children.push(gridColumn);
    }
}

class figmaTabbar extends figmaField {
    constructor(tabBar: TabBar) {
        super('Tabbar', 'FRAME');

        const tabs = new figmaField('Tabs', 'NEW INSTANCE');
        tabs.componentNode = compTabbar;

        const maxTabsCount = 13;

        for (let i = 0; i < maxTabsCount - 1; i++) {
            const propertyName = `${i+1} tab#6936:${i}`;
            tabs.properties[propertyName] = i + 1 <= tabBar.Tabs.length;
        }

        for (let i = 0; i < tabBar.Tabs.length; i++) {
            const tab = (tabBar.Tabs[i] as unknown) as Tab;
            const figmaTab = new figmaField(`Tab ${i+1}`, 'EXISTING INSTANCE');
            figmaTab.properties['State'] = 'Normal';
            figmaTab.properties['Value ▶#3265:0'] = tab.Label;
            figmaTab.properties['Selected'] = tab.IsActive ? 'True' : 'False';
            tabs.children.push(figmaTab);
        }

        this.children.push(tabs);

        tabBar.Children.forEach(fs => {
            switch (fs.Type) {
                case AcuElementType.Template: {
                    this.children.push(new figmaTemplate(fs as Template));
                    break;
                }
                case AcuElementType.Grid: {
                    this.children.push(new figmaGrid((fs as unknown) as Grid, 'Grid', true));
                    break;
                }
            }
        });
    }
}

class figmaTemplate extends figmaField {
    constructor(template: Template) {
        super('Template', 'FRAME');
        this.layoutMode = 'HORIZONTAL';

        let x = 0;
        let w = (viewportWidth - (horizontalSpacing * (template.Children.length - 1))) / template.Children.length;
        const parts = template.Name?.split('-').map(p => parseInt(p)) ?? [];
        let sum = 0;

        parts?.forEach((part, i) => {
            sum += part;
        })

        template.Children.forEach((fs, i) => {
            let curW = w;
            if (sum > 0)
                curW = (viewportWidth - (horizontalSpacing * (template.Children.length - 1))) * parts[i] / sum;
            switch (fs.Type) {
                case AcuElementType.FieldSet: {
                    this.children.push(new figmaFieldSet(fs as QPFieldset, curW));
                    break;
                }
                case AcuElementType.FieldsetSlot: {
                    this.children.push(new figmaSlot(fs as FieldsetSlot, curW));
                    break;
                }
            }
        });
    }
}

class figmaSlot extends figmaField {
    constructor(slot: FieldsetSlot, width = 0) {
        super('slot', 'FRAME', width);

        slot.Children.forEach(fs => {
            switch (fs.Type) {
                case AcuElementType.FieldSet: {
                    this.children.push(new figmaFieldSet(fs as QPFieldset, width));
                    break;
                }
            }
        });
    }
}

class figmaRoot extends figmaField {
    constructor(root: Root) {
        super('root', 'FRAME');

        for (const fs of root.Children) {
            switch (fs.Type) {
                case AcuElementType.Template:
                    this.children.push(new figmaTemplate(fs as Template));
                    break;
                case AcuElementType.Tabbar:
                    this.children.push(new figmaTabbar(fs as TabBar));
                    break;
                case AcuElementType.Grid:
                    this.children.push(new figmaGrid(fs as Grid, 'Grid', true));
                    break;
            }
        }
    }
}

class figmaFieldSet extends figmaField{

    static Wrappings = {
        Gray: "Gray",
        Blue: "Blue",
        Default: "Default"
    }

    showHeaderPropName = 'Show Group Header#6619:0';
    wrappingPropName =  'Wrapping';
    showGridPropName = 'Show grid#5425:0';
    showRowPropNames = [
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
        super('FieldSet', 'NEW INSTANCE', width);
        this.componentNode = compFieldset;

        const showHeader = (fs.Label != '' && fs.Label != null)
        this.properties[this.showHeaderPropName] = showHeader;
        if (showHeader) {
            let child = new figmaField('Group Header');
            child.properties['Text Value ▶#4494:3'] = fs.Label??'';
            this.children.push(child);
        }

        if (fs.Highlighted)
            this.properties[this.wrappingPropName] = figmaFieldSet.Wrappings.Blue;

        let rowNumber = 0;
        for (const child of fs.Children) {
            if (child.Type == AcuElementType.Grid) {
                this.properties[this.showGridPropName] = true;
                this.children.push(new figmaGrid(child as unknown as Grid, 'Grid', false));
            }
            else
                this.children.push(new figmaRow(child as QPField, `Row ${++rowNumber}`));
        }

        for (let i = 0; i < this.showRowPropNames.length; i++)
            this.properties[this.showRowPropNames[i]] = (rowNumber > i);
    }

}


function DrawHeader(frame: FrameNode, root: Root) {

    const background = figma.createRectangle();
    background.resize(pageWidth, pageHeight);
    background.fills = [{
        type: 'SOLID',
        color: {r: 1, g: 1, b: 1}
    }];

    const header = compHeader.createInstance();
    header.x = horizontalSpacing / 2;
    header.y = -header.height - verticalSpacing / 2;
    header.resize(viewportWidth, header.height);
    SetProperties(header, {
        ['Link Value ▶#6711:0']: root.Caption1,
        ['Title Value ▶#6711:8']: root.Caption2
    });
    figma.currentPage.appendChild(header);

    const mainHeader = compMainHeader.createInstance();
    mainHeader.y = -header.height - mainHeader.height - verticalSpacing;
    mainHeader.resize(pageWidth, mainHeader.height);
    figma.currentPage.appendChild(mainHeader);

    const leftMenu = compLeftMenu.createInstance();
    leftMenu.x = -leftMenu.width;
    leftMenu.y = -header.height - verticalSpacing;
    leftMenu.resize(leftMenu.width, background.height - mainHeader.height);
    figma.currentPage.appendChild(leftMenu);

    frame.resize(pageWidth - leftMenu.width, pageHeight + leftMenu.y);

    mainHeader.x = -leftMenu.width;

    background.x = mainHeader.x;
    background.y = mainHeader.y;

    return figma.group([background, mainHeader, leftMenu, header], figma.currentPage);
}

async function DrawFromHTML(input: string) {

    progress = 0;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20));

    let root: Root;
    if (input === '')
        return;
    else
        root = JSON.parse(input) as Root;
    const frame = figma.createFrame() as FrameNode;

    frame.resize(pageWidth, pageHeight);
    frame.layoutMode = "VERTICAL";
    frame.itemSpacing = verticalSpacing;
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO"
    frame.paddingLeft = horizontalSpacing / 2;
    frame.name = 'Canvas';

    const headerGroup = DrawHeader(frame, root);
    headerGroup.name = 'Header';
    const mainGroup = figma.group([headerGroup], figma.currentPage);
    mainGroup.insertChild(1, frame);
    mainGroup.name = root.Caption1??'Screen';

    const rootItem = new figmaRoot(root);
    //console.log(rootItem);
    childrenNumber = countChildren(rootItem);

    progress = 5;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20));

    await Draw(rootItem as figmaField, frame);
    frame.primaryAxisSizingMode = "AUTO";

}

function countChildren(root: figmaRoot){
    let count = 1;
    for (const child of root.children) {
        count += countChildren(child);
    }
    return count;
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: { input: string, format: string }) => {

    if (msg.format === '') {
        figma.closePlugin();
        return;
    }

    await figma.loadAllPagesAsync();

    // Test
    // csFieldset = await figma.importComponentSetByKeyAsync('65edf1d775107cc11081226f698821a462c6edc2');
    // csHeader = await figma.importComponentSetByKeyAsync('80265c2d8ad685491923b57b91c64b3e0989a943');
    // csMainHeader = await figma.importComponentSetByKeyAsync('2f11715b6ef9f03dad26d0c30e330fa824c18e96');
    // cGrid = await figma.importComponentSetByKeyAsync('d6ed7417ddbc12fb781ef5a69d497ef543b5b1bf');
    // cLeftMenu = await figma.importComponentByKeyAsync('790c900390c36c1d7dd582d34f12e1e9ed4c8866');
    // cTabbar = await figma.importComponentByKeyAsync('6908d5b76e824d2a677a35490265b9d64efb3606');

    // Prod
    compFieldset    = (await figma.importComponentSetByKeyAsync('3738d3cfa01194fc3cfe855bf127daa66b21e39e')).defaultVariant;
    compHeader      = (await figma.importComponentSetByKeyAsync('6bf3d7f22449e758cc2b697dd7d80ad7a2d3c21a')).defaultVariant;
    compMainHeader  = (await figma.importComponentSetByKeyAsync('95717954e19e7929d19b33f7bcd03f16e8e1a51b')).defaultVariant;
    compGrid        = (await figma.importComponentSetByKeyAsync('b6b4901b43589a4e2e738087122069e2df254b8f')).defaultVariant;
    compLeftMenu    = await figma.importComponentByKeyAsync('5b4ee7b5f881aa8f6e64f128f4cceef050357378');
    compTabbar      = await figma.importComponentByKeyAsync('e4b7a83b5e34cee8565ad8079b4932764b45dae4');

    if (msg.format === 'html')
        await DrawFromHTML(msg.input);

    figma.closePlugin();
};
