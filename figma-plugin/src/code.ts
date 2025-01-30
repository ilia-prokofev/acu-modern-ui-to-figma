// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

import {processScreen} from './figma-main';

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width: 650, height: 540});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { input: string, reuseSummary: boolean, format: string }): void => {
    void processScreen(msg.input, msg.format, msg.reuseSummary);
};
