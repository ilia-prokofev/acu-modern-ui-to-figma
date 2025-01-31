import {AcuElementType} from '@modern-ui-to-figma/elements';
import {TabBar} from '@modern-ui-to-figma/elements';
import {Root} from '@modern-ui-to-figma/elements';
import {IconType} from '@modern-ui-to-figma/elements';
import {FigmaNode} from './figma-node';
import {Logger} from './logger';
import {FigmaRoot} from './figma-root';
import {FigmaFieldSet} from "./figma-field-set";
import {FigmaTree} from "./figma-tree";
import {FigmaTemplate} from "./figma-template";
import {FigmaTabBar} from "./figma-tab-bar";
import {FigmaSplitContainer} from "./figma-split-container";
import {FigmaRichTextEditor} from "./figma-rich-text-editor";
import {FigmaImageViewer} from "./figma-image-viewer";
import { QPImage } from '@modern-ui-to-figma/elements';
import { QPRichTextEditor } from '@modern-ui-to-figma/elements';
import { QPSplitContainer } from '@modern-ui-to-figma/elements';
import { Template } from '@modern-ui-to-figma/elements';
import { QPTree } from '@modern-ui-to-figma/elements';
import { AcuElement } from '@modern-ui-to-figma/elements';
import { QPFieldset } from '@modern-ui-to-figma/elements';
import {FigmaSlot} from "./figma-slot";
import { FieldsetSlot } from '@modern-ui-to-figma/elements';
import {FigmaGrid} from "./figma-grid";
import { Grid } from '@modern-ui-to-figma/elements';
import { Tab } from '@modern-ui-to-figma/elements';

export const horizontalSpacing = 12;
const verticalSpacing = 12;
const padding = 24;
const pageWidth = 1364;//1600;
const pageHeight = 900;
export const viewportWidth = pageWidth - 80 - padding * 2;
const viewportHeight = pageHeight - 50;

export const logger = new Logger();

let childrenNumber = 0;
let childrenProcessed = 0;
let progress = 0;
let isCancelled = false;

export let compFieldset = undefined as unknown as ComponentNode;
export let compHeader = undefined as unknown as ComponentNode;
export let compMainHeader = undefined as unknown as ComponentNode;
export let compLeftMenu = undefined as unknown as ComponentNode;
export let compGrid = undefined as unknown as ComponentNode;
export let compTabBar = undefined as unknown as ComponentNode;
export let compCheckbox = undefined as unknown as ComponentNode;
export let compImageViewer = undefined as unknown as ComponentNode;
export let compRichTextEditor = undefined as unknown as ComponentNode;
export let compSplitter = undefined as unknown as ComponentNode;
export let compTree = undefined as unknown as ComponentNode;

export const buttonIcons = new Map<IconType, string>([
    [IconType.Refresh, 'c49868efe2dfa88095d9db037824cdd7721ad06e'],
    [IconType.Undo, '6229695a70dcf7ded45f99f84288ae92b03c7c56'],
    [IconType.Insert, 'de700daf8268fce0d3acff9011f4a936bf77f714'],
    [IconType.Edit, 'b9257482b69a7be89190abee18ad34b6d42a9184'],
    [IconType.AdjustColumns, '83ed0e23748392291c66e9de42c2f6c42a4c634f'],
    [IconType.ExportToExcel, '54921de81540be32af6fc0af318f2b4937ad32ee'],
    [IconType.Copy, '7a292951e78c1b33bb1214a62617efaf264cb18e'],
    [IconType.Delete, '3768bac5ab85ab45fe6abc62eacf515cddddee11'],
    [IconType.First, '339e24e29430577c293d9826f77fabc48053d077'],
    [IconType.Last, '7c9aa4dd8f3449ddbdee384b8d348676ed5c2142'],
    [IconType.Back, 'ff33972c40f4435a4020c8ce300c305f68ac0a84'],
    [IconType.Previous, 'defe6a35b414086383ab7b4dd627a757e9349b01'],
    [IconType.Next, 'ac17253deb51f88a538228224f12f5b2bec0b64e'],
    [IconType.Save, '55688f66ef69a0bf4abc6ac8e48b561f4c08fc4f'],
    [IconType.SaveAndBack, '7693000f6771b4135a00ad062e3b9b4b718b6ceb'],
    [IconType.Import, '9bbe97f874029e4de44a1f28f9fa76cd39bfef29'],
    [IconType.Ellipsis, '19be5dec53338a1bd35ff1f7e409da34d5f1e287'],
    [IconType.AddRow, 'de700daf8268fce0d3acff9011f4a936bf77f714'],
    [IconType.DeleteRow, '4eb380b404d2d81e5c704961928388fd224c3964'],
    [IconType.ArrowDown, '800ef65e596f2ae7e722ca31984f4d649c4ccc63'],
]);
const buttonIconIDs = new Map<IconType, string>();

function SetProperties(instanceNode: InstanceNode, figmaNode: FigmaNode): void {
    try {
        instanceNode.setProperties(figmaNode.componentProperties);
    } catch (e) {
        logger.Warn(`${(e as Error).message}: ${JSON.stringify(figmaNode.componentProperties)}`, figmaNode.acuElement?.Id, figmaNode);
    }
}

async function Draw(figmaNode: FigmaNode, parent: InstanceNode | PageNode | GroupNode | FrameNode | ComponentNode, setView = false): Promise<void> {
    if (isCancelled) {
        stopNow();
        return;
    }
    childrenProcessed++;
    if (childrenProcessed == childrenNumber || childrenProcessed % 10 == 0) {
        progress = Math.floor(childrenProcessed * 90 / childrenNumber) + 10;
        figma.ui.postMessage({type: 'progress', progress});
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    let instance = figmaNode.figmaObject;
    if (!instance) {
        if (figmaNode.tryToFind) {
            if (figmaNode.childIndex >= 0)
                instance = parent.children[figmaNode.childIndex] as InstanceNode;
            else
                instance = parent.findOne(n => n.type === figmaNode.type && n.name === figmaNode.name) as InstanceNode;

            if (!instance && !figmaNode.createIfNotFound) {
                logger.Warn(`${figmaNode.name} not found`, figmaNode.acuElement?.Id, parent);
                return;
            }
        }

        if (!instance) {
            switch (figmaNode.type) {
            case 'INSTANCE':
                instance = figmaNode.componentNode!.createInstance();
                break;
            case 'FRAME':
                instance = figma.createFrame();
                instance.layoutMode = figmaNode.layoutMode;
                instance.itemSpacing = figmaNode.layoutMode == 'VERTICAL' ? verticalSpacing : horizontalSpacing;
                break;
            }
            instance.name = figmaNode.name;
            parent.appendChild(instance);
        }
    }

    if (figmaNode.width > 0 || figmaNode.height > 0)
        instance.resize(figmaNode.width > 0 ? figmaNode.width : instance.width, figmaNode.height > 0 ? figmaNode.height : instance.height);

    for (const iconPropertyName in figmaNode.iconProperties) {
        const icon = figmaNode.iconProperties[iconPropertyName];
        if (!buttonIconIDs.has(icon))
            logger.Warn(`${icon} icon is not supported`, figmaNode.acuElement?.Id);
        else
            figmaNode.componentProperties[iconPropertyName] = buttonIconIDs.get(figmaNode.iconProperties[iconPropertyName])!;
    }

    if (instance.type === 'INSTANCE')
        SetProperties(instance, figmaNode);

    for (const property in figmaNode.properties) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        instance[property] = figmaNode.properties[property];
    }

    figmaNode.figmaObject = instance;

    if (setView)
        figma.viewport.scrollAndZoomIntoView([instance]);

    if (figmaNode.detach) {
        instance = (instance as InstanceNode).detachInstance();
        if (figmaNode.acuElement?.Type == AcuElementType.Field)
            instance.children[1].remove();
    }

    for (const child of figmaNode.children)
        await Draw(child, instance);
}

export async function DrawFromJSON(input: string, reuseSummary: boolean): Promise<void> {
    if (input === '')
        return;

    let root;
    try {
        root = JSON.parse(input) as Root;
    } catch (ex) {
        logger.Warn(ex as string);
        return;
    }

    const rootItem = new FigmaRoot(root);
    console.log(rootItem);
    childrenNumber = countChildren(rootItem);

    let screenName = root.Title ?? 'Screen';
    let drawSummaryComponent = false;
    let summary;
    let compSummary: ComponentNode | null = null;

    if (rootItem.children.length >= 2 &&
        rootItem.children[rootItem.children.length - 2].acuElement?.Type == AcuElementType.Template &&
        rootItem.children[rootItem.children.length - 1].acuElement?.Type == AcuElementType.Tabbar) {
        summary = rootItem.children[rootItem.children.length - 2];
        setSummaryStretching(summary);

        if (reuseSummary) {

            const workPage = figma.currentPage;
            const libPageName = 'Component Library';
            let libPage = figma.root.children.find(p => p.name === libPageName);
            if (!libPage) {
                libPage = figma.createPage();
                libPage.name = libPageName;
            }

            const componentName = `${screenName} Summary`;
            compSummary = libPage.children.find(n => n.type === 'COMPONENT' && n.name === componentName) as ComponentNode;

            if (!compSummary) {
                await figma.setCurrentPageAsync(libPage);
                const componentGap = 100;
                let componentY = 0;
                for (const child of libPage.children) {
                    if (child.y + child.height + componentGap > componentY)
                        componentY = child.y + child.height + componentGap;
                }

                compSummary = figma.createComponent();
                compSummary.y = componentY;
                compSummary.layoutMode = 'HORIZONTAL';
                compSummary.primaryAxisSizingMode = 'AUTO';
                compSummary.counterAxisSizingMode = 'AUTO';
                compSummary.name = componentName;
                summary.name = componentName;

                drawSummaryComponent = true;
            }

            let tabName = 'undefined';
            const tabBar = rootItem.children[rootItem.children.length - 1].acuElement as TabBar;
            tabBar.Tabs.forEach((tab:Tab) => {
                if (tab.IsActive)
                    tabName = tab.Label;
            })

            screenName = `${screenName} - ${tabName}`;

            await figma.setCurrentPageAsync(workPage);
            const summaryNode = new FigmaNode('Summary', 'INSTANCE')
            summaryNode.tryToFind = false;
            summaryNode.componentNode = compSummary;

            rootItem.children[rootItem.children.length - 2] = summaryNode;
            if (!drawSummaryComponent)
                childrenNumber = countChildren(rootItem);
        }
    }

    progress = 10;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20));

    const frameCanvas = await CreateCanvas(screenName, root.Caption ?? root.Title, root.Caption == null ? null : root.Title);
    if (!frameCanvas.figmaObject) return;

    if (drawSummaryComponent && compSummary)
        await Draw(summary as FigmaNode, compSummary);

    rootItem.figmaObject = frameCanvas.figmaObject;
    await Draw(rootItem as FigmaNode, frameCanvas.figmaObject);
    frameCanvas.figmaObject.primaryAxisSizingMode = 'AUTO';

    const lastItem = getLastItem(rootItem);
    if (lastItem.acuElement?.Type == AcuElementType.Grid &&
        frameCanvas.figmaObject.height > viewportHeight) {
        const grid = lastItem.figmaObject;
        if (grid) {
            const newGridHeight = Math.max(250, grid.height - frameCanvas.figmaObject.height + viewportHeight);
            grid.resize(grid.width, newGridHeight);
        }
    }
}

export function addChild(parent: FigmaNode, parentType: AcuElementType, child: AcuElement, slotWidth: number) {
    switch (child.Type) {
        case AcuElementType.FieldSet:
            parent.children.push(new FigmaFieldSet(child as QPFieldset, slotWidth));
            break;
        case AcuElementType.FieldsetSlot:
            parent.children.push(new FigmaSlot(child as FieldsetSlot, slotWidth));
            break;
        case AcuElementType.Grid:
            const grid = new FigmaGrid((child as unknown) as Grid, 'Grid', true);
            switch (parentType)
            {
                case AcuElementType.Root:
                    break;
                case AcuElementType.Tabbar:
                    grid.width = slotWidth;
                    break;
                default:
                    grid.properties['layoutAlign'] = 'STRETCH';
                    grid.height = 250;
                    grid.width = slotWidth;
                    break
            }
            parent.children.push(grid);
            break;
        case AcuElementType.Image:
            parent.children.push(new FigmaImageViewer(child as QPImage, slotWidth));
            break;
        case AcuElementType.RichTextEditor:
            parent.children.push(new FigmaRichTextEditor(child as QPRichTextEditor, slotWidth));
            break;
        case AcuElementType.SplitContainer:
            parent.children.push(new FigmaSplitContainer(child as QPSplitContainer, slotWidth));
            break;
        case AcuElementType.Tabbar:
            parent.children.push(new FigmaTabBar(child as TabBar, slotWidth));
            break;
        case AcuElementType.Template:
            parent.children.push(new FigmaTemplate(child as Template, slotWidth));
            break;
        case AcuElementType.Tree:
            parent.children.push(new FigmaTree(child as QPTree, slotWidth));
            break;
    }
}

async function CreateCanvas(screenName: string, screenTitle: string | null, backLink: string | null): Promise<FigmaNode> {
    const frameScreenVertical = new FigmaNode(screenName, 'FRAME', pageWidth, pageHeight);
    frameScreenVertical.tryToFind = false;
    frameScreenVertical.properties['itemSpacing'] = 0;
    frameScreenVertical.properties['primaryAxisSizingMode'] = 'AUTO';

    const gap = 100;
    let newScreenY = 0;
    for (const child of figma.currentPage.children) {
        if (child.y + child.height + gap > newScreenY)
            newScreenY = child.y + child.height + gap;
    }
    frameScreenVertical.properties['y'] = newScreenY;

    const fieldMainHeader = new FigmaNode('MainHeader', 'INSTANCE', pageWidth);
    fieldMainHeader.tryToFind = false;
    fieldMainHeader.componentNode = compMainHeader;
    frameScreenVertical.children.push(fieldMainHeader);

    const frameScreenHorizontal = new FigmaNode('FrameH', 'FRAME', pageWidth);
    frameScreenHorizontal.tryToFind = false;
    frameScreenHorizontal.properties['primaryAxisSizingMode'] = 'FIXED';
    frameScreenHorizontal.properties['counterAxisSizingMode'] = 'AUTO';
    frameScreenHorizontal.properties['layoutMode'] = 'HORIZONTAL';
    frameScreenHorizontal.properties['itemSpacing'] = 0;
    frameScreenVertical.children.push(frameScreenHorizontal);

    const fieldLeftMenu = new FigmaNode('LeftMenu', 'INSTANCE');
    fieldLeftMenu.tryToFind = false;
    fieldLeftMenu.componentNode = compLeftMenu;
    fieldLeftMenu.properties['layoutAlign'] = 'STRETCH';
    frameScreenHorizontal.children.push(fieldLeftMenu);

    const frameCanvas = new FigmaNode('Canvas', 'FRAME', pageWidth - compLeftMenu.width);
    frameCanvas.tryToFind = false;
    frameCanvas.properties['counterAxisSizingMode'] = 'FIXED';
    frameCanvas.properties['itemSpacing'] = verticalSpacing;
    frameCanvas.properties['paddingLeft'] = padding;
    frameCanvas.properties['paddingRight'] = padding;
    frameCanvas.properties['paddingBottom'] = padding;
    frameScreenHorizontal.children.push(frameCanvas);

    const fieldHeader = new FigmaNode('Header', 'INSTANCE', viewportWidth);
    fieldHeader.tryToFind = false;
    fieldHeader.componentNode = compHeader;
    fieldHeader.componentProperties['Show Back Link#3139:0'] = backLink != null;
    fieldHeader.componentProperties['Link Value ▶#6711:0'] = backLink ?? '';
    fieldHeader.componentProperties['Title Value ▶#6711:8'] = screenTitle ?? '';
    frameCanvas.children.push(fieldHeader);

    childrenNumber += countChildren(frameScreenVertical);
    await Draw(frameScreenVertical, figma.currentPage, true);

    return frameCanvas;
}

function countChildren(root: FigmaRoot): number {
    let count = 1;
    for (const child of root.children) {
        count += countChildren(child);
    }
    return count;
}

function setSummaryStretching(root: FigmaNode): void {
    if (root.acuElement?.Type == AcuElementType.FieldSet) {
        root.properties['primaryAxisSizingMode'] = 'FIXED';
        root.properties['layoutAlign'] = 'STRETCH';
    }
    for (const child of root.children) {
        setSummaryStretching(child);
    }
}

function getLastItem(root: FigmaRoot): FigmaRoot {
    if (root.children.length == 0)
        return root;
    else {
        const lastChild = root.children[root.children.length - 1];
        if (!lastChild.acuElement)
            return root;
        return getLastItem(lastChild);
    }
}

function stopNow(): void {
    figma.ui.postMessage({type: 'unlock'});
    childrenNumber = 0;
    childrenProcessed = 0;
    progress = 0;
    figma.ui.postMessage({type: 'progress', progress});
}

export async function processScreen(input: string, format: string, reuseSummary: boolean): Promise<void> {
    if (format === 'cancel') {
        isCancelled = true;
        logger.Log('Canceled');
        figma.ui.postMessage({type: 'log', log: logger.GetLog()});
        stopNow();
        return;
    }

    logger.Clear();
    figma.ui.postMessage({type: 'log', log: logger.GetLog()});
    isCancelled = false;
    const startTime = Date.now();
    progress = 5;
    figma.ui.postMessage({type: 'progress', progress});
    await new Promise(resolve => setTimeout(resolve, 20));

    await figma.loadAllPagesAsync();

    compFieldset = (await figma.importComponentSetByKeyAsync('3738d3cfa01194fc3cfe855bf127daa66b21e39e')).defaultVariant;
    compHeader = (await figma.importComponentSetByKeyAsync('6bf3d7f22449e758cc2b697dd7d80ad7a2d3c21a')).defaultVariant;
    compMainHeader = (await figma.importComponentSetByKeyAsync('95717954e19e7929d19b33f7bcd03f16e8e1a51b')).defaultVariant;
    compGrid = (await figma.importComponentSetByKeyAsync('b6b4901b43589a4e2e738087122069e2df254b8f')).defaultVariant;
    compCheckbox = (await figma.importComponentSetByKeyAsync('4b4affdd12a4320b054701445e4c34aa95af7198')).defaultVariant;
    compImageViewer = (await figma.importComponentSetByKeyAsync('ba08cb51bc3ad778dc9221d76aaa1baaf1f6ae7b')).defaultVariant;
    compRichTextEditor = (await figma.importComponentSetByKeyAsync('cb542d6b221cd1cb4302529415ff7bb4a135eb67')).defaultVariant;
    compSplitter = (await figma.importComponentSetByKeyAsync('c671076454c35e10bb86f1ef18936e7953cec793')).defaultVariant;
    compLeftMenu = await figma.importComponentByKeyAsync('5b4ee7b5f881aa8f6e64f128f4cceef050357378');
    compTabBar = await figma.importComponentByKeyAsync('e4b7a83b5e34cee8565ad8079b4932764b45dae4');
    compTree = await figma.importComponentByKeyAsync('ae9880fe4ddbd5f4c7e2784492b78b12ba47c14a');

    for (const [iconType, componentKey] of buttonIcons) {
        const icon = await figma.importComponentByKeyAsync(componentKey);
        buttonIconIDs.set(iconType, icon.id);
    }

    if (format === 'json')
        await DrawFromJSON(input, reuseSummary);

    const endTime = Date.now();
    logger.Log(`Completed in ${Math.floor((endTime - startTime) / 1000)}s`);
    figma.ui.postMessage({type: 'log', log: logger.GetLog()});

    stopNow();
}