// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

import AcuPageParser from "./acu-page-parser";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

interface Fieldset {
  label: string;
  fields: Field[];
}

interface Field {
  label: string;
  type: string;
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

function SetProperty(node: InstanceNode, property: string, newVal : string) {
  const propertyName: string = FindPropertyName(node, property);
  node.setProperties({[propertyName]: newVal});
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage =  async(msg: {input: string}) => {


  //await figma.loadAllPagesAsync();
  
  console.log('asd');
  const parser = new AcuPageParser();
  const root = await parser.parse(msg.input);
  console.log(JSON.stringify(root));
  return;

  const schema: Fieldset[] = JSON.parse(msg.input);
  console.log(schema);

  schema.forEach(fs => {
    console.log(fs.label);
    const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Fieldset') as ComponentSetNode;
    const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm') as ComponentNode;
    const instance = component.createInstance();
    instance.x = 0;
    instance.y = 0;

    const header = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Group Header') as InstanceNode;
    //header.setProperties({'Text Value ▶#4494:3': fs.label});
    SetProperty(header, 'Text Value', 'aasd');

    instance.setProperties({'Show Row 1': true});
    instance.setProperties({'Show Row 2': true});
    instance.setProperties({'Show Row 3': true});
    instance.setProperties({'Show Row 4': false});
    instance.setProperties({'Show Row 5': false});
    figma.currentPage.appendChild(instance);
  
    
  });
  
  // const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Row') as ComponentSetNode;
  // const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Type=Currency, Label Position=Left, Label Length=s') as ComponentNode;
  // const instance = component.createInstance();
  // instance.setProperties({'Type': 'Checkbox'});
  // instance.x = 0;
  // instance.y = 0;
  // figma.currentPage.appendChild(instance);


  // const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Fieldset') as ComponentSetNode;
  // const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm') as ComponentNode;
  // const instance = component.createInstance();
  // instance.x = 0;
  // instance.y = 0;
  // instance.setProperties({'Show Row 1': true});
  // instance.setProperties({'Show Row 2': true});
  // instance.setProperties({'Show Row 3': true});
  // instance.setProperties({'Show Row 4': false});
  // instance.setProperties({'Show Row 5': false});
  // figma.currentPage.appendChild(instance);

  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === 'create-shapes1') {
  //   // This plugin creates rectangles on the screen.
  //   const numberOfRectangles = msg.count;

  //   const nodes: SceneNode[] = [];
  //   for (let i = 0; i < numberOfRectangles; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
