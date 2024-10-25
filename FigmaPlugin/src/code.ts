
// import AcuPageParser from "../acu-page-parser";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
import {AcuElement} from "../../ChromeExt/src/elements/acu-element";

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

function FindPropertyName(node: InstanceNode, property: string) {
  let t: keyof ComponentProperties;
  for (t in node.componentProperties)
  {
    if(t.startsWith(property))
      return t;
  }
  return '';
}

function SetStringProperty(node: InstanceNode, property: string, newVal : string) {
  const propertyName: string = FindPropertyName(node, property);
  node.setProperties({[propertyName]: newVal});
}

function SetBoolProperty(node: InstanceNode, property: string, newVal : boolean) {
  const propertyName: string = FindPropertyName(node, property);
  node.setProperties({[propertyName]: newVal});
}

function DrawFieldset(fs: Fieldset, dx = 0, dy = 0)
{
  let i: string | number;
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

  for (i = 1; i <= Math.max(5, fs.fields.length); i++) {
    SetBoolProperty(instance, 'Show Row ' + i + '#', i <= fs.fields.length);
  }

  for (i = 1; i <= fs.fields.length; i++) {
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

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async(msg: {input: string, format: string}) => {

  if (msg.format === '')
  {
    figma.closePlugin();
    return;
  }

  if (msg.format === 'html')
  {
    // console.log('html is not supported yet');
    // const parser = new AcuPageParser();
    // const root = await parser.parse(msg.input);
    // console.log(JSON.stringify(root));
    return;
  }

  await figma.loadAllPagesAsync();
  
  //const schema: Container[] = JSON.parse(msg.input);
  const element = JSON.parse(msg.input) as AcuElement;
  console.log(JSON.stringify(element));

  const schema: Fieldset[] = JSON.parse(msg.input);
  console.log(schema);

  let dx = 0;
  let dy = 0;

  schema.forEach(fs => {
    const {newX, newY} = DrawFieldset(fs, dx, 0);
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

  componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Toolbar') as ComponentSetNode;
  component = componentSet.defaultVariant;
  const toolbar = component.createInstance();
  toolbar.x = -50;
  toolbar.y = -toolbar.height - spacer;
  figma.currentPage.appendChild(toolbar);

  componentSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Main header') as ComponentSetNode;
  component = componentSet.defaultVariant;
  const mainHeader = component.createInstance();
  mainHeader.x = -50;
  mainHeader.y = -toolbar.height-mainHeader.height-spacer;
  figma.currentPage.appendChild(mainHeader);

  figma.closePlugin();
};
