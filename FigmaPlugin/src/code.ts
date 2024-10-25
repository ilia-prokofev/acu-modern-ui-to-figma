
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

figma.showUI(__html__, { width: 600, height: 350 });

const spacer = 20;
const pageWidth = 1200;

function MapElementType(type: QPFieldElementType)
{
  switch (type){
    case QPFieldElementType.CheckBox : return 'Checkbox';
    case QPFieldElementType.Currency : return 'Currency';
    case QPFieldElementType.DatetimeEdit : return 'Date';
    case QPFieldElementType.DropDown : return 'Label + Field';
    case QPFieldElementType.NumberEditor : return 'Label + Number Field';
    case QPFieldElementType.Selector : return 'Label + Field';
    case QPFieldElementType.Status : return 'Label + Field';
    case QPFieldElementType.TextEditor : return 'Label + Text Area';
    default: return 'Label + Field';
  }

}

function FindPropertyName(node: InstanceNode, property: string) {
  let t: keyof ComponentProperties;
  for (t in node.componentProperties)
  {
    if(t.startsWith(property))
      return t;
  }
  return '';
}

function SetProperty(node: InstanceNode, property: string, newVal: any) {
  const propertyName: string = FindPropertyName(node, property);
  node.setProperties({[propertyName]: newVal});
}

function DrawSlot(template: FieldsetSlot, x = 0, y = 0, w = 0)
{
  let x1 = 0;
  template.Children.forEach(fs => {
    switch (fs.Type){
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

function DrawGrid(grid: Grid, y = 0)
{
  const componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Grid') as ComponentSetNode;
  const component = componentSet.defaultVariant;
  const instance = component.createInstance();
  instance.x = 0;
  instance.y = y;
  figma.currentPage.appendChild(instance);
}

function DrawTabBar(tb: TabBar, y = 0)
{
  let x = 0;
  let w = pageWidth - (spacer * (tb.Children.length - 1)) / tb.Children.length;

  const component = figma.root.findOne(node => node.type === 'COMPONENT' && node.name === 'Tabbar') as ComponentNode;
  const instance = component.createInstance();
  instance.x = 0;
  instance.y = y;
  figma.currentPage.appendChild(instance);

  y += instance.height + spacer;

  tb.Children.forEach(fs => {
    switch (fs.Type){
      case AcuElementType.Template: {
        y = DrawTemplate(fs as Template, y);
        break;
      }
      case AcuElementType.Grid: {
        DrawGrid((fs as unknown) as Grid);
        break;
      }
    }
  });
  return y;
}

function DrawTemplate(template: Template, y = 0)
{
  let x = 0;
  let w = pageWidth - (spacer * (template.Children.length - 1)) / template.Children.length;
  let y1 = y;
  template.Children.forEach(fs => {
    switch (fs.Type){
      case AcuElementType.FieldSet: {
        const {newX, newY} = DrawFieldset(fs as QPFieldset, x, y, w);
        x = newX;
        y1 = Math.max(newY, y1);
        break;
      }
      case AcuElementType.FieldsetSlot: {
        const {newX, newY} = DrawSlot(fs as FieldsetSlot, x, y, w);
        x = newX;
        y1 = Math.max(newY, y1);
        break;
      }
    }
  });
  return y1;
}


function DrawFieldset(fs: QPFieldset, x = 0, y = 0, w = 0)
{
  const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Fieldset') as ComponentSetNode;
  const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm') as ComponentNode;
  const instance = component.createInstance();
  instance.x = x;
  instance.y = y;
  if (w > 0)
    instance.resize(w, instance.height);

  const header = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Group Header') as InstanceNode;
  if (fs.Label === undefined || fs.Label === '')
    SetProperty(instance, 'Show Group Header', false);
  else
    SetProperty(header, 'Text Value', fs.Label??'');

  // if (fs.class === 'highlights-section')
  // {
  //   SetStringProperty(instance, 'Wrapping', 'Blue');
  //   SetStringProperty(instance, 'Label Length', 'm');
  // }

  for (let i = 1; i <= Math.max(5, fs.Children.length); i++) {
    SetProperty(instance, 'Show Row ' + i + '#', i <= fs.Children.length);
  }

  for (let i = 0; i < fs.Children.length; i++) {
    const field = fs.Children[i] as QPField;
    const rowNode = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Row ' + (i + 1)) as InstanceNode;

    if (field.ElementType === QPFieldElementType.CheckBox)
    {
      //const rowNode = figma.root.findOne(node => node.name === 'Row 1999') as InstanceNode;
      // const cb = row.findOne(node => node.type === 'INSTANCE' && node.name === 'Checkbox') as InstanceNode;
      // SetProperty(cb, 'Value', 'qqq');

      const labelNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Checkbox') as InstanceNode;
      const all = rowNode.findAll();
      console.log(all);

      // console.log('in checkbox labelNode = ');
      // console.log(rowNode);
      // console.log(rowNode.name);
      if (labelNode){
        // console.log('checkbox');
        SetProperty(labelNode, 'Value', field.Label);
      }
    }
    else
    {
      const labelNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Label') as InstanceNode;
      if (labelNode)
        SetProperty(labelNode, 'Label Value', field.Label);
      }
      
    if (rowNode)
      SetProperty(rowNode, 'Type', MapElementType(field.ElementType!));
    if (field.Value)
    {
      let valueNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Field');
      if (valueNode)
        SetProperty(valueNode as InstanceNode, 'Text Value', field.Value);
      else
      {
        valueNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'TextArea');
        if (valueNode)
          SetProperty(valueNode as InstanceNode, 'Text Value', field.Value);
      }
    }
  }

  figma.currentPage.appendChild(instance);
  
  x += instance.width + spacer;
  y += instance.height + spacer;

  console.log(x);
  console.log(y);

  return {newX: x, newY: y}
}

function DrawHeader(x = 0, y = 0) {
  let componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Header') as ComponentSetNode;
  let component = componentSet.defaultVariant;
  const toolbar = component.createInstance();
  toolbar.x = 0;
  toolbar.y = - toolbar.height - spacer / 2;
  figma.currentPage.appendChild(toolbar);

  componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Main header') as ComponentSetNode;
  component = componentSet.defaultVariant;
  const mainHeader = component.createInstance();
  mainHeader.x = 0;
  mainHeader.y = - toolbar.height - mainHeader.height - spacer;
  figma.currentPage.appendChild(mainHeader);

  component = figma.root.findOne(node => node.type === 'COMPONENT' && node.name === 'Left menu/Default') as ComponentNode;
  const leftMenu = component.createInstance();
  leftMenu.x = -leftMenu.width - spacer / 2;
  leftMenu.y = -toolbar.height - spacer;
  figma.currentPage.appendChild(leftMenu);

  mainHeader.x = - leftMenu.width - spacer / 2;
}

function generateRoot() {
  
  const qpField1: QPField = {Type: AcuElementType.Field, Label: 'Turn on', ElementType: QPFieldElementType.CheckBox, Value: 'true'};
  const qpField2: QPField = {Type: AcuElementType.Field, Label: 'Currency', ElementType: QPFieldElementType.Currency, Value: 'EUR'};
  const qpField3: QPField = {Type: AcuElementType.Field, Label: 'Date To', ElementType: QPFieldElementType.DatetimeEdit, Value: '06/07/2024'};
  const qpField4: QPField = {Type: AcuElementType.Field, Label: 'Total Amount', ElementType: QPFieldElementType.NumberEditor, Value: '1256.50'};
  const qpField5: QPField = {Type: AcuElementType.Field, Label: 'Project', ElementType: QPFieldElementType.Selector, Value: 'X'};
  const qpField6: QPField = {Type: AcuElementType.Field, Label: 'Description', ElementType: QPFieldElementType.TextEditor, Value: 'Here would be very very very very long string. Or not.'};
  const qpFieldSet1: QPFieldset = {Label: 'Default values', Type: AcuElementType.FieldSet, Children: [
      qpField1,
      qpField2,
      qpField3,
      qpField4
    ]};
  const qpFieldSet2: QPFieldset = {Label: 'Default values', Type: AcuElementType.FieldSet, Children: [
      qpField5,
      qpField6
    ]};
  const qpFieldSet3: QPFieldset = {Label: 'Default values', Type: AcuElementType.FieldSet, Children: [
      qpField4,
      qpField5,
      qpField1,
      qpField2,
      qpField3,
      qpField6
    ]};
  const qpFieldSet4: QPFieldset = {Label: 'Default values', Type: AcuElementType.FieldSet, Children: [
      qpField2,
      qpField4,
      qpField1,
      qpField3,
      qpField5,
      qpField6
    ]};
  const Slot1: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "1", Children: [qpFieldSet1, qpFieldSet2]};
  const Slot2: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "2", Children: [qpFieldSet3]};
  const Slot3: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "1", Children: [qpFieldSet4]};
  const Slot4: FieldsetSlot = {Type: AcuElementType.FieldsetSlot, ID: "2", Children: [qpFieldSet2, qpFieldSet1]};
  const template1: Template = {Type: AcuElementType.Template, Name: '7-10-7', Children: [Slot1, Slot2]};
  const template2: Template = {Type: AcuElementType.Template, Name: '7-10-7', Children: [Slot3, Slot4]};
  const tab1: Tab = {Type:AcuElementType.Tab, Label : 'Details', IsActive: false};
  const tab2: Tab = {Type:AcuElementType.Tab,Label: 'Bills', IsActive: true};
  const tab3: Tab = {Type:AcuElementType.Tab,Label: 'Finance', IsActive: false};
  const col1: GridColumn = {Label: 'Test 1', ColumnType: GridColumnType.Text, Cells: ['a', 'b']};
  const grid: Grid = {Type: AcuElementType.Grid, Columns: [col1], Children:[]};
  //const tabBar: TabBar = {Type: AcuElementType.Tabbar, Tabs: [tab1, tab2, tab3], Children: [template2]};

  const templateS: Template = {Type: AcuElementType.Template, Name: '7-10-7', Children: [qpFieldSet1]};
  const tabBar: TabBar = {Type: AcuElementType.Tabbar, Tabs: [tab1, tab2, tab3], Children: [templateS]};
  const root: AcuContainer = {Type: AcuElementType.Root, Children: [templateS, tabBar]};
  //const root: AcuContainer = {Type: AcuElementType.Root, Children: [template1, tabBar]};
  return root;
}

function DrawFromHTML(input: string) {
    // const parser = new AcuPageParser();
    // const root = await parser.parse(msg.input);
    // console.log(JSON.stringify(root));
    
    let root = null;
    if (input === '')
      root = generateRoot();
    else
      root = JSON.parse(input) as AcuContainer;

    console.log(root);

    let y = 0;

    root.Children.forEach(fs => {
      switch (fs.Type){
        case AcuElementType.Template: {
          y = DrawTemplate(fs as Template, y);
          break;
        }
        case AcuElementType.Tabbar: {
          DrawTabBar(fs as TabBar);
          break;
        }
        case AcuElementType.Grid: {
          DrawGrid((fs as unknown) as Grid);
          break;
        }
      }
    });

    DrawHeader();
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async(msg: {input: string, format: string}) => {

  if (msg.format === '')
  {
    figma.closePlugin();
    return;
  }

  await figma.loadAllPagesAsync();

  if (msg.format === 'html')
    DrawFromHTML(msg.input);

  figma.closePlugin();
};
