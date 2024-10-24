"use strict";
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
function FindPropertyName(node, property) {
    let t;
    for (t in node.componentProperties) {
        if (t.startsWith(property))
            return t;
    }
    return '';
}
function SetProperty(node, property, newVal) {
    const propertyName = FindPropertyName(node, property);
    node.setProperties({ [propertyName]: newVal });
}
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.input === '') {
        //figma.closePlugin();
        //return;
        msg.input = "[{\"label\":\"Default settings\",\"fields\":[{\"label\":\"Non-Project Code\",\"type\":\"text-editor\"},{\"label\":\"Empty Item UOM\",\"type\":\"selector\"},{\"label\":\"Cost Budget Update\",\"type\":\"drop-down\"},{\"label\":\"Automatically Post\",\"type\":\"checkbox\"}]},{\"label\":\"222\",\"fields\":[{\"label\":\"Non-Project Code\",\"type\":\"text-editor\"},{\"label\":\"Empty Item UOM\",\"type\":\"selector\"},{\"label\":\"Cost Budget Update\",\"type\":\"drop-down\"},{\"label\":\"Automatically Post\",\"type\":\"checkbox\"}]}]";
    }
    yield figma.loadAllPagesAsync();
    const schema = JSON.parse(msg.input);
    console.log(schema);
    schema.forEach(fs => {
        console.log(fs.label);
        const compSet = figma.root.findOne(node => node.type === 'COMPONENT_SET' && node.name === 'Fieldset');
        const component = compSet.findOne(node => node.type === 'COMPONENT' && node.name === 'Wrapping=Gray, Label Length=sm');
        const instance = component.createInstance();
        instance.x = 0;
        instance.y = 0;
        const header = instance.findOne(node => node.type === 'INSTANCE' && node.name === 'Group Header');
        //header.setProperties({'Text Value ▶#4494:3': fs.label});
        SetProperty(header, 'Text Value', 'aasd');
        instance.setProperties({ 'Show Row 1': true });
        instance.setProperties({ 'Show Row 2': true });
        instance.setProperties({ 'Show Row 3': true });
        instance.setProperties({ 'Show Row 4': false });
        instance.setProperties({ 'Show Row 5': false });
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
});
