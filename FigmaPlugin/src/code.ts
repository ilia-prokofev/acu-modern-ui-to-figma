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
import {AcuContainer} from "./elements/acu-container";
import {Tab, TabBar} from "./elements/qp-tabbar";
import {Grid, GridColumn, GridColumnType} from "./elements/qp-grid";
import {FrameNode} from "@figma/plugin-typings/plugin-api-standalone";
import {Root} from "./elements/qp-root";

figma.showUI(__html__, {width: 650, height: 410});

const spacer = 20;
const pageWidth = 1536;
const  pageHeight = 864;
const viewportWidth = pageWidth - 100;

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
    if (newVal === undefined || newVal === null) return;
    if (property === '') return;
    const propertyName: string = FindPropertyName(node, property);
    if (propertyName === '') return;
    node.setProperties({[propertyName]: newVal});
}

function DrawSlot(template: FieldsetSlot, x = 0, y = 0, w = 0) {
    let x1 = 0;
    template.Children.forEach(fs => {
        switch (fs.Type) {
            case AcuElementType.FieldSet: {
                const {newX, newY} = DrawFieldset(fs as QPFieldset, x, y, w);
                x1 = newX;
                y = Math.max(newY, y);
                break;
            }
        }
    });
    return {newX: x1, newY: y};
}

function DrawGrid(grid: Grid, y = 0) {
    const component = figma.root.findOne(node => node.type === 'COMPONENT' && node.name === 'Grid20') as ComponentNode;
    const instance = component.createInstance();
    instance.x = 0;
    instance.y = y;

    // const columns = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Columns') as ComponentSetNode;
    // for (let i = 1; i <= Math.max(20, grid.Columns.length); i++) {
    //     instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Columns') as ComponentSetNode;
    //     SetProperty(instance, `${i} tab`, i <= grid.Columns.length);
    // }

    figma.currentPage.appendChild(instance);
}

function DrawTabBar(tb: TabBar, y = 0) {
    let x = 0;
    let w = viewportWidth - (spacer * (tb.Children.length - 1)) / tb.Children.length;

    const component = figma.root.findOne(node => node.type === 'COMPONENT' && node.name === 'Tabbar') as ComponentNode;
    const instance = component.createInstance();
    instance.x = 0;
    instance.y = y;

    for (let i = 1; i <= Math.max(10, tb.Tabs.length); i++) {
        SetProperty(instance, `${i} tab`, i <= tb.Tabs.length);
    }

    for (let i = 0; i < tb.Tabs.length; i++) {
        const tab = (tb.Tabs[i] as unknown) as Tab;
        const node = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Tab ' + (i + 1)) as InstanceNode;

        try {
            SetProperty(node, 'State', 'Normal');
        }
        catch (e) {}
        try {
            SetProperty(node, 'Value', tab.Label);
        }
        catch (e) {}
        //SetProperty(node, 'Selected', tab.IsActive);
    }

    figma.currentPage.appendChild(instance);

    y += instance.height + spacer;

    tb.Children.forEach(fs => {
        switch (fs.Type) {
            case AcuElementType.Template: {
                y = DrawTemplate(fs as Template, y);
                break;
            }
            case AcuElementType.Grid: {
                DrawGrid((fs as unknown) as Grid, y);
                break;
            }
        }
    });
    return y;
}

function DrawTemplate(template: Template, y = 0) {
    let x = 0;
    let w = (viewportWidth - (spacer * (template.Children.length - 1))) / template.Children.length;
    const parts = template.Name?.split('-').map(p => parseInt(p)) ?? [];
    let sum = 0;

    parts?.forEach((part, i) => {
        sum += part;
    })

    let y1 = y;

    template.Children.forEach((fs, i) => {
        let curW = w;
        if (sum > 0)
            curW = (viewportWidth - (spacer * (template.Children.length - 1))) * parts[i] / sum;
        switch (fs.Type) {
            case AcuElementType.FieldSet: {
                const {newX, newY} = DrawFieldset(fs as QPFieldset, x, y, curW);
                x = newX;
                y1 = Math.max(newY, y1);
                break;
            }
            case AcuElementType.FieldsetSlot: {
                const {newX, newY} = DrawSlot(fs as FieldsetSlot, x, y, curW);
                x = newX;
                y1 = Math.max(newY, y1);
                break;
            }
        }
    });
    return y1;
}

function DrawFieldset(fs: QPFieldset, x = 0, y = 0, w = 0) {
    const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Fieldset') as ComponentSetNode;
    const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm') as ComponentNode;
    const instance = component.createInstance();
    instance.x = x;
    instance.y = y;
    if (w > 0)
        instance.resize(w, instance.height);

    const header = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Group Header') as InstanceNode;
    if (fs.Label)
        SetProperty(header, 'Text Value', fs.Label ?? '');
    else
        SetProperty(instance, 'Show Group Header', false);

    if (fs.Highlighted) {
        SetProperty(instance, 'Wrapping', 'Blue');
        //SetProperty(instance, 'Label Length', 'm');
    }

    for (let i = 1; i <= Math.max(5, fs.Children.length); i++) {
        SetProperty(instance, 'Show Row ' + i + '#', i <= fs.Children.length);
    }

    for (let i = 0; i < fs.Children.length; i++) {
        const field = fs.Children[i] as QPField;
        const rowNode = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Row ' + (i + 1)) as InstanceNode;

        if (field.ElementType === QPFieldElementType.CheckBox) {
            //const rowNode = figma.root.findOne(node => node.name === 'Row 1999') as InstanceNode;
            // const cb = row.findOne(node => node.type === 'INSTANCE' && node.name === 'Checkbox') as InstanceNode;
            // SetProperty(cb, 'Value', 'qqq');

            const labelNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Checkbox') as InstanceNode;

            // console.log('in checkbox labelNode = ');
            // console.log(rowNode);
            // console.log(rowNode.name);
            if (labelNode) {
                // console.log('checkbox');
                SetProperty(labelNode, 'Value', field.Label);
            }
        } else {
            const labelNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Label') as InstanceNode;
            if (labelNode)
                SetProperty(labelNode, 'Label Value', field.Label);
        }

        if (rowNode)
            SetProperty(rowNode, 'Type', MapElementType(field.ElementType!));
        if (field.Value) {
            let valueNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Field');
            if (valueNode)
                SetProperty(valueNode as InstanceNode, 'Text Value', field.Value);
            else {
                valueNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'TextArea');
                if (valueNode)
                    SetProperty(valueNode as InstanceNode, 'Text Value', field.Value);
            }
        }
    }

    figma.currentPage.appendChild(instance);

    x += instance.width + spacer;
    y += instance.height + spacer;

    return {newX: x, newY: y}
}

function DrawHeader(frame: FrameNode, root: Root) {
    let componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Header') as ComponentSetNode;
    let component = componentSet.defaultVariant;
    const header = component.createInstance();
    header.x = 0;
    header.y = -header.height - spacer / 2;
    header.resize(viewportWidth, header.height);
    SetProperty(header, 'Link Value', root.Caption1);
    SetProperty(header, 'Title Value', root.Caption2);
    figma.currentPage.appendChild(header);

    componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Main header') as ComponentSetNode;
    component = componentSet.defaultVariant;
    const mainHeader = component.createInstance();
    mainHeader.x = 0;
    mainHeader.y = -header.height - mainHeader.height - spacer;
    mainHeader.resize(pageWidth, mainHeader.height);
    figma.currentPage.appendChild(mainHeader);

    component = figma.root.findOne(node => node.type === 'COMPONENT' && node.name === 'Left menu/Default') as ComponentNode;
    const leftMenu = component.createInstance();
    leftMenu.x = -leftMenu.width - spacer / 2;
    leftMenu.y = -header.height - spacer;
    leftMenu.resize(leftMenu.width, frame.height - mainHeader.height);
    figma.currentPage.appendChild(leftMenu);

    mainHeader.x = -leftMenu.width - spacer / 2;

    frame.x = mainHeader.x;
    frame.y = mainHeader.y;
}

function generateRoot() {

    const qpField1: QPField = {
        Type: AcuElementType.Field,
        Label: 'Turn on',
        ElementType: QPFieldElementType.CheckBox,
        Value: 'true'
    };
    const qpField2: QPField = {
        Type: AcuElementType.Field,
        Label: 'Currency',
        ElementType: QPFieldElementType.Currency,
        Value: 'EUR'
    };
    const qpField3: QPField = {
        Type: AcuElementType.Field,
        Label: 'Date To',
        ElementType: QPFieldElementType.DatetimeEdit,
        Value: '06/07/2024'
    };
    const qpField4: QPField = {
        Type: AcuElementType.Field,
        Label: 'Total Amount',
        ElementType: QPFieldElementType.NumberEditor,
        Value: '1256.50'
    };
    const qpField5: QPField = {
        Type: AcuElementType.Field,
        Label: 'Project',
        ElementType: QPFieldElementType.Selector,
        Value: 'X'
    };
    const qpField6: QPField = {
        Type: AcuElementType.Field,
        Label: 'Description',
        ElementType: QPFieldElementType.TextEditor,
        Value: 'Here would be very very very very long string. Or not.'
    };
    const qpFieldSet1: QPFieldset = {
        Label: 'Default values', Type: AcuElementType.FieldSet, Highlighted: true, Children: [
            qpField1,
            qpField2,
            qpField3,
            qpField4
        ]
    };
    const qpFieldSet2: QPFieldset = {
        Label: 'Default values', Type: AcuElementType.FieldSet, Highlighted: false, Children: [
            qpField5,
            qpField6
        ]
    };
    const qpFieldSet3: QPFieldset = {
        Label: 'Default values', Type: AcuElementType.FieldSet, Highlighted: false, Children: [
            qpField4,
            qpField5,
            qpField1,
            qpField2,
            qpField3,
            qpField6
        ]
    };
    const qpFieldSet4: QPFieldset = {
        Label: 'Default values', Type: AcuElementType.FieldSet, Highlighted: false, Children: [
            qpField2,
            qpField4,
            qpField1,
            qpField3,
            qpField5,
            qpField6
        ]
    };
    const Slot1: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "1", Children: [qpFieldSet1, qpFieldSet2]};
    const Slot2: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "2", Children: [qpFieldSet3]};
    const Slot3: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "1", Children: [qpFieldSet4]};
    const Slot4: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "2", Children: [qpFieldSet2, qpFieldSet1]};
    const template1: Template = {Type: AcuElementType.Template, Name: '7-10-7', Children: [Slot1, Slot2]};
    const template2: Template = {Type: AcuElementType.Template, Name: '7-10-7', Children: [Slot3, Slot4]};
    const tab1: Tab = {Type: AcuElementType.Tab, Label: 'Details1', IsActive: false};
    const tab2: Tab = {Type: AcuElementType.Tab, Label: 'Bills1', IsActive: false};
    const tab3: Tab = {Type: AcuElementType.Tab, Label: 'Finance1', IsActive: true};
    const col1: GridColumn = {
        Type: AcuElementType.GridColumn,
        Label: 'Test 1',
        ColumnType: GridColumnType.Text,
        Cells: ['a', 'b']
    };
    const grid: Grid = {Type: AcuElementType.Grid, Columns: [col1]};
    //const tabBar: TabBar = {Type: AcuElementType.Tabbar, Tabs: [tab1, tab2, tab3], Children: [template2]};

    const templateS: Template = {
        Type: AcuElementType.Template,
        Name: '7-10-7',
        Children: [qpFieldSet1, qpFieldSet2]
    };
    const tabBar: TabBar = {Type: AcuElementType.Tabbar, Tabs: [tab1, tab2, tab3], Children: []};
    //const root: AcuContainer = {Type: AcuElementType.Root, Children: [templateS]};
    const root: Root = {
        Caption1: 'Subcontracts',
        Caption2: 'New Record',
        Type: AcuElementType.Root,
        Children: [tabBar]
    };
    return root;
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
        root = generateRoot();
    else
        root = JSON.parse(input) as Root;
    frame.name = root.Caption2??'Screen';


    let y = 0;

    let progress = 5;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20))

    DrawHeader(frame, root);

    progress += 15;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20))

    for (const fs of root.Children) {
        switch (fs.Type) {
            case AcuElementType.Template:
                y = DrawTemplate(fs as Template, y);
                break;
            case AcuElementType.Tabbar:
                y = DrawTabBar(fs as TabBar, y);
                break;
            case AcuElementType.Grid:
                DrawGrid((fs as unknown) as Grid);
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

    await figma.loadAllPagesAsync();

    if (msg.format === 'html')
        await DrawFromHTML(msg.input);

    figma.closePlugin();
};
