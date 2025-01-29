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
import {AcuElement, AcuElementType} from "./elements/acu-element";
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
import {DrawFromJSON, figmaRoot, Log, stopNow} from "./figma-root";

figma.showUI(__html__, {width: 650, height: 540});

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

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: { input: string, reuseSummary: boolean, format: string }) => {
    if (msg.format === 'cancel') {
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

    if (msg.format === 'json')
        await DrawFromJSON(msg.input, msg.reuseSummary);

    const endTime = Date.now();
    Log(`Completed in ${Math.floor((endTime - startTime) / 1000)}s`);
    figma.ui.postMessage({ type: 'log', log: log.join('\n') });

    stopNow();
};
