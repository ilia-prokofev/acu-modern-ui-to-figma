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


class Timer {
    private measurements: Map<string, { count: number; totalTime: number }> = new Map();

    // Начало замера
    start(): number {
        return Date.now(); // Возвращаем текущее время для начала замера
    }

    // Окончание замера
    stop(operationName: string, startTime: number): void {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        const record = this.measurements.get(operationName);
        if (record) {
            // Обновляем существующий замер
            record.count++;
            record.totalTime += elapsedTime;
        } else {
            // Создаем новый замер
            this.measurements.set(operationName, { count: 1, totalTime: elapsedTime });
        }
    }

    // Получить статистику по операции
    getStats(operationName: string): { count: number; totalTime: number } | null {
        return this.measurements.get(operationName) || null;
    }

    // Получить статистику для всех операций
    getAllStats(): Map<string, { count: number; totalTime: number }> {
        return this.measurements;
    }
}

const timer = new Timer();

const spacer = 20;
const pageWidth = 1536;
const pageHeight = 864;
const viewportWidth = pageWidth - 100;

const fieldsetRows = new Map<string, string>();

let csFieldset = undefined as unknown as ComponentSetNode;
let csHeader = undefined as unknown as ComponentSetNode;
let csMainHeader = undefined as unknown as ComponentSetNode;

let cLeftMenu = undefined as unknown as ComponentNode;
let csGrid = undefined as unknown as ComponentSetNode;
let cTabbar = undefined as unknown as ComponentNode;

function MapElementType(type: QPFieldElementType) {
    switch (type) {
        case QPFieldElementType.CheckBox :
            return 'Checkbox';
        case QPFieldElementType.Currency :
            return 'Currency';
        case QPFieldElementType.DatetimeEdit :
            return 'Date';
        case QPFieldElementType.DropDown :
            return 'Label + Field';
        // case QPFieldElementType.NumberEditor :
        //     return 'Label + Number Field';
        case QPFieldElementType.Selector :
            return 'Label + Field';
        case QPFieldElementType.Status :
            return 'Label + Field';
        case QPFieldElementType.TextEditor :
            return 'Label + Field';
        case QPFieldElementType.RadioButton :
            return 'Radio Button';
        case QPFieldElementType.MultilineTextEditor :
            return 'Label + Text Area';
        default:
            return 'Label + Field';
    }

}

function FindPropertyName(node: InstanceNode, property: string) {
    let t: keyof ComponentProperties;
    for (t in node.componentProperties) {
        if (t.startsWith(property))
            return t;
    }
    return '';
}

function SetProperty(node: InstanceNode, property: string, newVal: string|boolean|null|undefined) {

    const startTime = timer.start();

    if (newVal === undefined || newVal === null) return;
    if (property === '') return;
    try {
        node.setProperties({[property]: newVal});
    }
    catch (e) {
        console.error(node.name, e);
    }

    timer.stop("SetProperty", startTime);
}

function SetProperties(node: InstanceNode, properties: any) {

    const startTime = timer.start();

    try {
        node.setProperties(properties);
    }
    catch (e) {
        console.error(node.name, e);
    }

    timer.stop("SetProperty", startTime);
}

function DrawSlot(parent: GroupNode, template: FieldsetSlot, x = 0, y = 0, w = 0) {
    let x1 = 0;
    const children: BaseNode[] = [];
    template.Children.forEach(fs => {
        switch (fs.Type) {
            case AcuElementType.FieldSet: {
                const {newX, newY, instance} = DrawFieldset(fs as QPFieldset, x, y, w);
                children.push(instance);
                x1 = newX;
                y = Math.max(newY, y);
                break;
            }
        }
    });
    const group = figma.group(children, parent);
    group.name = 'Slot';
    return {newX: x1, newY: y, instance: group};
}

function DrawGrid(grid: Grid, instance : InstanceNode | undefined, x = 0, y = 0, w = 0) {
    let displayedRows = 0;
    const displayedColumns = 13;
    const displayedRowsDefault = 5;
    const displayedRowsMax = 10;
    const displayedColumnsDefault = 10;

    if (!instance) {
        instance = csGrid.defaultVariant.createInstance() as InstanceNode;
        instance.x = x;
        instance.y = y;
        instance.resize(w == 0 ? viewportWidth : w, pageHeight - y);
        figma.currentPage.appendChild(instance);
    }

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
        console.log(i);
        const column = grid.Columns[i-1];
        const columnInstance = instance.findOne(node => node.type === 'INSTANCE' && node.name === `Grid Column ${i}`) as InstanceNode;
        columnInstance.visible = true;

        SetProperty(columnInstance, 'Type', column.ColumnType);
        if (column.Alignment == 'Right')
            SetProperty(columnInstance, 'Alignment', 'Right');

        for (let j = displayedRows; j < displayedRowsDefault; j++) {
            const cell = columnInstance.children[j + 1] as InstanceNode;
            SetProperty(cell, 'Show Value#4709:42', false);
        }

        if (column.ColumnType != GridColumnType.Settings)
            for (let j = displayedRowsDefault; j < displayedRows; j++) {
                const cell = columnInstance.children[j + 1] as InstanceNode;
                SetProperty(cell, 'Show Value#4709:42', true);
            }

        if (column.ColumnType != GridColumnType.Text) continue;

        const header = columnInstance.children[0] as InstanceNode;
        SetProperty(header, 'Value#6706:49', column.Label);

        for (let j = 0; j < column.Cells.length; j++) {
            const cell = columnInstance.children[j + 1] as InstanceNode;
            SetProperty(cell, 'Value#6706:0', column.Cells[j]);
        }

        for (let j = column.Cells.length; j < displayedRows; j++) {
            const cell = columnInstance.children[j + 1] as InstanceNode;
            SetProperty(cell, 'Value#6706:0', '');
        }
    }

    for (let i = visibleColumns + 1; i <= displayedColumnsDefault; i++) {
        console.log(i);
        const columnInstance = instance.findOne(node => node.type === 'INSTANCE' && node.name === `Grid Column ${i}`) as InstanceNode;
        columnInstance.visible = false;
    }

    const columnInstance = instance.findOne(node => node.type === 'INSTANCE' && node.name === `Grid Column 20`) as InstanceNode;
    columnInstance.visible = false;

}

function DrawTabBar(parent:GroupNode, tb: TabBar, y = 0) {
    const maxTabsCount = 13;
    let x = 0;
    let w = viewportWidth - (spacer * (tb.Children.length - 1)) / tb.Children.length;

    const instance = cTabbar.createInstance() as InstanceNode;
    instance.x = 0;
    instance.y = y;

    for (let i = 0; i < maxTabsCount - 1; i++) {
        const propertyName = `${i+1} tab#6936:${i}`;
        SetProperty(instance, propertyName, i + 1 <= tb.Tabs.length);
    }

    for (let i = 0; i < tb.Tabs.length; i++) {
        const tab = (tb.Tabs[i] as unknown) as Tab;
        const node = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Tab ' + (i + 1)) as InstanceNode;
        if (node)
            SetProperties(node, {
                'State': 'Normal',
                'Value ▶#3265:0': tab.Label,
                'Selected': tab.IsActive ? 'True' : 'False'
            });

    }

    figma.currentPage.appendChild(instance);
    figma.group([instance], parent).name = 'Tabs';

    y += instance.height + spacer;

    tb.Children.forEach(fs => {
        switch (fs.Type) {
            case AcuElementType.Template: {
                y = DrawTemplate(parent, fs as Template, y);
                break;
            }
            case AcuElementType.Grid: {
                DrawGrid((fs as unknown) as Grid, undefined, x, y);
                break;
            }
        }
    });
    return y;
}

function DrawTemplate(parent: GroupNode, template: Template, y = 0) {
    let x = 0;
    let w = (viewportWidth - (spacer * (template.Children.length - 1))) / template.Children.length;
    const parts = template.Name?.split('-').map(p => parseInt(p)) ?? [];
    let sum = 0;

    parts?.forEach((part, i) => {
        sum += part;
    })

    let y1 = y;

    const children: BaseNode[] = [];

    template.Children.forEach((fs, i) => {
        let curW = w;
        if (sum > 0)
            curW = (viewportWidth - (spacer * (template.Children.length - 1))) * parts[i] / sum;
        switch (fs.Type) {
            case AcuElementType.FieldSet: {
                const {newX, newY, instance} = DrawFieldset(fs as QPFieldset, x, y, curW);
                children.push(instance);
                x = newX;
                y1 = Math.max(newY, y1);
                break;
            }
            case AcuElementType.FieldsetSlot: {
                const {newX, newY, instance} = DrawSlot(parent, fs as FieldsetSlot, x, y, curW);
                children.push(instance);
                x = newX;
                y1 = Math.max(newY, y1);
                break;
            }
        }
    });

    figma.group(children, parent).name = 'Template';

    return y1;
}

function DrawFieldset(fs: QPFieldset, x = 0, y = 0, w = 0) {
    const startTime = timer.start();

    //const component = csFieldset.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm') as ComponentNode;
    const component = csFieldset.defaultVariant;
    timer.stop("DrawFieldset01", startTime);

    const instance = component.createInstance() as InstanceNode;
    timer.stop("DrawFieldset02", startTime);
    instance.x = x;
    instance.y = y;
    if (w > 0)
        instance.resize(w, instance.height);

    timer.stop("DrawFieldset03", startTime);

    const header = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Group Header') as InstanceNode;
    timer.stop("DrawFieldset04", startTime);
    if (fs.Label)
        SetProperty(header, 'Text Value ▶#4494:3', fs.Label ?? '');
    else
        SetProperty(instance, 'Show Group Header#6619:0', false);

    if (fs.Highlighted) {
        SetProperty(instance, 'Wrapping', 'Blue');
        //SetProperty(instance, 'Label Length', 'm');
    }

    const visibleRowsByDefault = 5;
    for (let i = Math.min(visibleRowsByDefault, fs.Children.length); i <= Math.max(visibleRowsByDefault, fs.Children.length); i++) {
        const propertyName = fieldsetRows.get(`Show Row ${i}`)??'';
        SetProperty(instance, propertyName, i <= fs.Children.length);
    }

    timer.stop("DrawFieldset05", startTime);

    for (let i = 0; i < fs.Children.length; i++) {
        const child = fs.Children[i];
        const field = child as QPField;

        let startTime1 = timer.start();
        const rowNode = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Row ' + (i + 1)) as InstanceNode;
        timer.stop("findOne rowNode", startTime1);
        timer.stop("findOne", startTime1);

        if (!rowNode) continue;

        if (child.Type == AcuElementType.Grid) {
            SetProperty(instance, 'Show grid#5425:0', true);
            const gridInstance = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Grid') as InstanceNode;
            DrawGrid((child as unknown) as Grid, gridInstance, x, y, w);
            const propertyName = fieldsetRows.get(`Show Row ${i}`)??'';
            SetProperty(instance, propertyName, false);
            console.log(`Grid`);
            continue;
        }

        SetProperty(rowNode, 'Type', MapElementType(field.ElementType!));

        if (field.ElementType == QPFieldElementType.RadioButton)
            SetProperties(rowNode, {
                ['Label Position']: 'Top',
                ['Label Length']: 's',
            });

        let propertyName = '';
        let nodeName = '';
        switch (field.ElementType) {
            case QPFieldElementType.CheckBox:
                nodeName = 'Checkbox';
                propertyName = 'Value ▶#6695:0';
                break;
            case QPFieldElementType.RadioButton:
                nodeName = 'Radiobuttons';
                propertyName = 'Name#8227:0';
                break;
            default:
                nodeName = 'Label';
                propertyName = 'Label Value ▶#3141:62';
                break;
        }
        const labelNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === nodeName) as InstanceNode;
        if (labelNode)
            SetProperty(labelNode, propertyName, field.Label);

        let value;
        switch (field.ElementType) {
            case QPFieldElementType.MultilineTextEditor:
                nodeName = 'Text Area';
                propertyName = 'Text Value ▶#4221:3';
                value = field.Value;
                break;
            case QPFieldElementType.RadioButton:
                nodeName = 'Radiobuttons';
                propertyName = 'Checked';
                value = field.Value == 'on' ? 'True' : 'False';
                break;
            case QPFieldElementType.CheckBox:
                nodeName = 'Checkbox';
                propertyName = 'Selected';
                value = field.Value == 'on' ? 'True' : 'False';
                break;
            default:
                nodeName = 'Field';
                propertyName = 'Text Value ▶#3161:0';
                value = field.Value;
                break;
        }

        const valueNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === nodeName) as InstanceNode;
        if (valueNode) {
            SetProperty(valueNode, propertyName, value);
            if (field.ReadOnly)
                SetProperty(valueNode, 'State', 'Disabled');

            if (field.ElementType == QPFieldElementType.Status) {
                SetProperty(valueNode, 'Type', 'Status');
                const status = valueNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Status') as InstanceNode;
                if (status)
                    SetProperty(status, 'Status', value);
            }
        }
    }

    figma.currentPage.appendChild(instance);

    x += instance.width + spacer;
    y += instance.height + spacer;

    timer.stop("DrawFieldset", startTime);

    return {newX: x, newY: y, instance: instance};
}

function DrawHeader(frame: FrameNode, root: Root) {
    //let componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Header') as ComponentSetNode;
    let component = csHeader.defaultVariant;
    const header = component.createInstance();
    header.x = 0;
    header.y = -header.height - spacer / 2;
    header.resize(viewportWidth, header.height);
    SetProperty(header, 'Link Value ▶#6711:0', root.Caption1);
    SetProperty(header, 'Title Value ▶#6711:8', root.Caption2);
    figma.currentPage.appendChild(header);

    //componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Main header') as ComponentSetNode;
    component = csMainHeader.defaultVariant;
    const mainHeader = component.createInstance();
    mainHeader.x = 0;
    mainHeader.y = -header.height - mainHeader.height - spacer;
    mainHeader.resize(pageWidth, mainHeader.height);
    figma.currentPage.appendChild(mainHeader);

    //component = figma.root.findOne(node => node.type === 'COMPONENT' && node.name === 'Left menu/Default') as ComponentNode;
    const leftMenu = cLeftMenu.createInstance();
    leftMenu.x = -leftMenu.width - spacer / 2;
    leftMenu.y = -header.height - spacer;
    leftMenu.resize(leftMenu.width, frame.height - mainHeader.height);
    figma.currentPage.appendChild(leftMenu);

    mainHeader.x = -leftMenu.width - spacer / 2;

    frame.x = mainHeader.x;
    frame.y = mainHeader.y;

    return figma.group([frame, mainHeader, leftMenu, header], figma.currentPage);
}

async function DrawFromHTML(input: string) {
    // const parser = new AcuPageParser();
    // const root = await parser.parse(msg.input);
    // console.log(JSON.stringify(root));

    const frame = figma.createFrame() as FrameNode;
    frame.x = 0;
    frame.y = 0;
    frame.resize(pageWidth, pageHeight);

    let root: Root;
    if (input === '')
        return;
    else
        root = JSON.parse(input) as Root;
    frame.name = 'Canvas';

    let y = 0;

    let progress = 5;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20))

    let startTime = timer.start();
    const headerGroup = DrawHeader(frame, root);
    headerGroup.name = 'Header';
    const mainGroup = figma.group([headerGroup], figma.currentPage);
    mainGroup.name = root.Caption1??'Screen';
    timer.stop("DrawHeader", startTime);

    progress += 15;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20))

    for (const fs of root.Children) {
        switch (fs.Type) {
            case AcuElementType.Template:
                startTime = timer.start();
                y = DrawTemplate(mainGroup, fs as Template, y);
                timer.stop("DrawTemplate", startTime);
                break;
            case AcuElementType.Tabbar:
                startTime = timer.start();
                y = DrawTabBar(mainGroup, fs as TabBar, y);
                timer.stop("DrawTabBar", startTime);
                break;
            case AcuElementType.Grid:
                startTime = timer.start();
                DrawGrid((fs as unknown) as Grid, undefined);
                timer.stop("DrawGrid", startTime);
                break;
        }
        progress += 25;
        figma.ui.postMessage({type: 'progress', progress});
        await new Promise(resolve => setTimeout(resolve, 20));
    }

}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: { input: string, format: string }) => {

    if (msg.format === '') {
        figma.closePlugin();
        return;
    }

    let startTime = timer.start();
    await figma.loadAllPagesAsync();
    timer.stop("loadAllPagesAsync", startTime);

    startTime = timer.start();

    // Test
    // csFieldset = await figma.importComponentSetByKeyAsync('65edf1d775107cc11081226f698821a462c6edc2');
    // csHeader = await figma.importComponentSetByKeyAsync('80265c2d8ad685491923b57b91c64b3e0989a943');
    // csMainHeader = await figma.importComponentSetByKeyAsync('2f11715b6ef9f03dad26d0c30e330fa824c18e96');
    // cGrid = await figma.importComponentSetByKeyAsync('d6ed7417ddbc12fb781ef5a69d497ef543b5b1bf');
    // cLeftMenu = await figma.importComponentByKeyAsync('790c900390c36c1d7dd582d34f12e1e9ed4c8866');
    // cTabbar = await figma.importComponentByKeyAsync('6908d5b76e824d2a677a35490265b9d64efb3606');

    // Prod
    csFieldset = await figma.importComponentSetByKeyAsync('3738d3cfa01194fc3cfe855bf127daa66b21e39e');
    csHeader = await figma.importComponentSetByKeyAsync('6bf3d7f22449e758cc2b697dd7d80ad7a2d3c21a');
    csMainHeader = await figma.importComponentSetByKeyAsync('95717954e19e7929d19b33f7bcd03f16e8e1a51b');
    csGrid = await figma.importComponentSetByKeyAsync('b6b4901b43589a4e2e738087122069e2df254b8f');
    cLeftMenu = await figma.importComponentByKeyAsync('5b4ee7b5f881aa8f6e64f128f4cceef050357378');
    cTabbar = await figma.importComponentByKeyAsync('e4b7a83b5e34cee8565ad8079b4932764b45dae4');

    timer.stop("importComponents", startTime);

    fieldsetRows.set("Show Row 1", "Show Row 1#5419:15");
    fieldsetRows.set("Show Row 2", "Show Row 2#5419:17");
    fieldsetRows.set("Show Row 3", "Show Row 3#5419:19");
    fieldsetRows.set("Show Row 4", "Show Row 4#5419:13");
    fieldsetRows.set("Show Row 5", "Show Row 5#5419:11");
    fieldsetRows.set("Show Row 6", "Show Row 6#5419:9");
    fieldsetRows.set("Show Row 7", "Show Row 7#5419:8");
    fieldsetRows.set("Show Row 8", "Show Row 8#5419:7");
    fieldsetRows.set("Show Row 9", "Show Row 9#5419:5");
    fieldsetRows.set("Show Row 10", "Show Row 10#5419:12");
    fieldsetRows.set("Show Row 11", "Show Row 11#5419:10");
    fieldsetRows.set("Show Row 12", "Show Row 12#5419:3");
    fieldsetRows.set("Show Row 13", "Show Row 13#5419:2");
    fieldsetRows.set("Show Row 14", "Show Row 14#5419:6");
    fieldsetRows.set("Show Row 15", "Show Row 15#5419:4");
    fieldsetRows.set("Show Row 16", "Show Row 16#5419:16");
    fieldsetRows.set("Show Row 17", "Show Row 17#5419:18");
    fieldsetRows.set("Show Row 18", "Show Row 18#5419:1");
    fieldsetRows.set("Show Row 19", "Show Row 19#5419:0");
    fieldsetRows.set("Show Row 20", "Show Row 20#5419:14");

    startTime = timer.start();
    if (msg.format === 'html')
        await DrawFromHTML(msg.input);
    timer.stop("DrawFromHTML", startTime);

    console.log("All Stats:", Array.from(timer.getAllStats()));

    figma.closePlugin();
};
