import {FigmaNode} from "./figma-node";
import {Tab, TabBar} from "./elements/qp-tabbar";
import {AcuElementType} from "./elements/acu-element";
import {figmaTemplate} from "./figma-template";
import {Template} from "./elements/qp-template";
import {QPTree} from "./elements/qp-tree";
import {Grid} from "./elements/qp-grid";
import {figmaSplitContainer} from "./figma-split-container";
import {QPSplitContainer} from "./elements/qp-split";
import {compTabbar, viewportWidth} from "./figma-main";
import {figmaTree} from "./figma-tree";
import {figmaGrid} from "./figma-grid";

export class figmaTabbar extends FigmaNode {
    constructor(tabBar: TabBar, width = 0) {
        super('Tabbar', 'FRAME', width == 0 ? viewportWidth : width);
        this.tryToFind = false;
        this.acuElement = tabBar;

        const tabs = new FigmaNode('Tabs');
        tabs.tryToFind = false;
        tabs.componentNode = compTabbar;

        const maxTabsCount = 13;

        for (let i = 0; i < maxTabsCount; i++) {
            const propertyName = `${i+1} tab#6936:${i}`;
            tabs.componentProperties[propertyName] = i + 1 <= tabBar.Tabs.length;
        }

        for (let i = 0; i < Math.min(tabBar.Tabs.length, maxTabsCount); i++) {
            const tab = (tabBar.Tabs[i] as unknown) as Tab;
            const figmaTab = new FigmaNode(`Tab ${i+1}`);
            figmaTab.componentProperties['State'] = 'Normal';
            figmaTab.componentProperties['Value ▶#3265:0'] = tab.Label;
            figmaTab.componentProperties['Selected'] = tab.IsActive ? 'True' : 'False';
            tabs.children.push(figmaTab);
        }

        this.children.push(tabs);

        tabBar.Children.forEach(fs => {
            switch (fs.Type) {
                case AcuElementType.Template: {
                    this.children.push(new figmaTemplate(fs as Template, width));
                    break;
                }
                case AcuElementType.Tree:
                    this.children.push(new figmaTree(fs as QPTree, width));
                    break;
                case AcuElementType.Grid: {
                    const grid = new figmaGrid((fs as unknown) as Grid, 'Grid', true);
                    grid.width = width;
                    this.children.push(grid);
                    break;
                }
                case AcuElementType.SplitContainer: {
                    this.children.push(new figmaSplitContainer(fs as QPSplitContainer, viewportWidth));
                    break;
                }
            }
        });
    }
}