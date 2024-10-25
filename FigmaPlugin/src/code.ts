
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
import {QPField, QPFieldElementType} from "./elements/qp-field";
import {Template} from "./elements/qp-template";
import {QPFieldset} from "./elements/qp-fieldset";
import {AcuElement, AcuElementType} from "./elements/acu-element";
import {FieldsetSlot} from "./elements/qp-fieldset-slot";
import {AcuContainer} from "./elements/acu-container";

figma.showUI(__html__);

const spacer = 20;

interface Container {
  name: string;
  align: string;
  children: Container | Fieldset | Tabbar;
}

interface Tabbar {
  tabs: Tabs;
  content: Container;
}

interface Tabs {
  tabs: string[];
  activeTab: string;
}

interface Fieldset {
  class: string;
  label: string;
  fields: Field[];
}

interface Field {
  label: string;
  type: string;
  value: string;
}

function MapType(type: string)
{
  switch (type){
    case 'datetime-edit': return 'Date';
    case 'currency': return 'Currency';
    case 'expanded': return 'Label + Text Area';
    case 'number-editor': return 'Label + Number Field';
    case 'qp-check-box-control': return 'Checkbox';
    default: return 'Label + Field';
  }

}

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

function SetStringProperty(node: InstanceNode, property: string, newVal : string) {
  const propertyName: string = FindPropertyName(node, property);
  node.setProperties({[propertyName]: newVal});
}

function SetBoolProperty(node: InstanceNode, property: string, newVal : boolean) {
  const propertyName: string = FindPropertyName(node, property);
  node.setProperties({[propertyName]: newVal});
}

function DrawFieldset_0(fs: Fieldset, dx = 0, dy = 0)
{
  console.log(fs.label);
  const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Fieldset') as ComponentSetNode;
  const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm') as ComponentNode;
  const instance = component.createInstance();
  instance.x = dx;
  instance.y = dy;

  const header = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Group Header') as InstanceNode;
  if (fs.label === undefined || fs.label === '')
    SetBoolProperty(instance, 'Show Group Header', false);
  else
    SetStringProperty(header, 'Text Value', fs.label);

  // if (fs.class === 'highlights-section')
  // {
  //   SetStringProperty(instance, 'Wrapping', 'Blue');
  //   SetStringProperty(instance, 'Label Length', 'm');
  // }

  for (var i = 1; i <= Math.max(5, fs.fields.length); i++) {
    SetBoolProperty(instance, 'Show Row ' + i + '#', i <= fs.fields.length);
  }

  for (var i = 1; i <= fs.fields.length; i++) {
    const field = fs.fields[i - 1];
    const rowNode = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Row ' + i) as InstanceNode;
    const labelNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Label') as InstanceNode;
    const fieldNode = rowNode.findOne(node => node.type === 'INSTANCE' && node.name === 'Field') as InstanceNode;
    if (labelNode)
      SetStringProperty(labelNode, 'Label Value', field.label);
    if (rowNode)
      SetStringProperty(rowNode, 'Type', MapType(field.type));
    // if (fieldNode && field.value)
    //   SetStringProperty(fieldNode, 'Text Value', field.value);
  }

  figma.currentPage.appendChild(instance);
  
  dx += instance.width + spacer;
  dy += instance.height + spacer;

  return {newX: dx, newY: dy}
}

function DrawSlot(template: FieldsetSlot, dx = 0, dy = 0)
{

}

function DrawTemplate(template: Template, dx = 0, dy = 0)
{
  template.Children.forEach(fs => {
    switch (fs.Type){
      case AcuElementType.FieldSet: {
        DrawFieldset(fs as QPFieldset);
        break;
      }
      case AcuElementType.FieldsetSlot: {
        DrawSlot(fs as FieldsetSlot);
        break;
      }
    }
  });
}


function DrawFieldset(fs: QPFieldset, dx = 0, dy = 0)
{
  console.log(fs.Label);
  const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Fieldset') as ComponentSetNode;
  const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm') as ComponentNode;
  const instance = component.createInstance();
  instance.x = dx;
  instance.y = dy;

  const header = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Group Header') as InstanceNode;
  if (fs.Label === undefined || fs.Label === '')
    SetBoolProperty(instance, 'Show Group Header', false);
  else
    SetStringProperty(header, 'Text Value', fs.Label??'');

  // if (fs.class === 'highlights-section')
  // {
  //   SetStringProperty(instance, 'Wrapping', 'Blue');
  //   SetStringProperty(instance, 'Label Length', 'm');
  // }

  for (var i = 1; i <= Math.max(5, fs.Children.length); i++) {
    SetBoolProperty(instance, 'Show Row ' + i + '#', i <= fs.Children.length);
  }

  for (var i = 0; i < fs.Children.length; i++) {
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
      SetProperty(rowNode, 'Type', MapElementType(field.ElementType));
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
  
  dx += instance.width + spacer;
  dy += instance.height + spacer;

  return {newX: dx, newY: dy}
}

function DrawToolbars(x = 0, y = 0) {
  let componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Toolbar') as ComponentSetNode;
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

function DrawFromJSON(input: string) {

  const row = figma.root.findOne(node => node.name === 'Row 1999') as InstanceNode;
  const cb = row.findOne(node => node.type === 'INSTANCE' && node.name === 'Checkbox') as InstanceNode;
  SetProperty(cb, 'Value', 'asd');

  return;

  if (input === '')
    input = "[{\"fields\":[{\"label\":\"Subcontract Nbr.\",\"type\":\"selector\",\"value\":\"SC-000034\"},{\"label\":\"Status\",\"type\":\"selector\",\"value\":\"open\"},{\"label\":\"Date\",\"type\":\"datetime-edit\",\"value\":\"10/24/2024\"},{\"label\":\"Start Date\",\"type\":\"datetime-edit\",\"value\":\"10/24/2024\"}]},{\"fields\":[{\"label\":\"Vendor\",\"type\":\"selector\"},{\"label\":\"Location\",\"type\":\"selector\"},{\"label\":\"Owner\",\"type\":\"selector\",\"value\":\"Maxwell Baker\"},{\"label\":\"Currency\",\"type\":\"currency\",\"value\":\"USD\"},{\"label\":\"Description\",\"type\":\"expanded\"}]},{\"fields\":[{\"label\":\"Detail Total\",\"type\":\"number-editor\",\"value\":\"100.00\"},{\"label\":\"Tax Total\",\"type\":\"number-editor\",\"value\":\"0.00\"},{\"label\":\"Subcontract Total\",\"type\":\"number-editor\",\"value\":\"100.00\"}]}]";

  const schema: Fieldset[] = JSON.parse(input);
  console.log(schema);

  let dx = 0;
  let dy = 0;

  schema.forEach(fs => {
    const {newX, newY} = DrawFieldset_0(fs, dx, 0);
    dx = newX;
    dy = Math.max(newY, dy);
  });
  
  let component = figma.root.findOne(node => node.type === 'COMPONENT' && node.name === 'Tabbar') as ComponentNode;
  let instance = component.createInstance();
  instance.x = 0;
  instance.y = dy;
  figma.currentPage.appendChild(instance);

  dy += instance.height + spacer;

  let componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Grid') as ComponentSetNode;
  component = componentSet.defaultVariant;
  instance = component.createInstance();
  instance.x = 0;
  instance.y = dy;
  figma.currentPage.appendChild(instance);
  
  DrawToolbars(dx, dy);

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
    qpField4,
    qpField5,
    qpField6
  ]};
  const template: Template = {Type: AcuElementType.Template, Name: '7-10-7', Children: [qpFieldSet1, qpFieldSet1]}
  const root: AcuContainer = {Type: AcuElementType.Root, Children: [template]}
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

    root.Children.forEach(fs => {
      switch (fs.Type){
        case AcuElementType.Template: {
          DrawTemplate(fs as Template);
          break;
        }
        case AcuElementType.FieldsetSlot: {
          DrawFieldset(fs as QPFieldset);
          break;
        }
      }
    });

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
  else
    DrawFromJSON(msg.input);

  figma.closePlugin();
};
