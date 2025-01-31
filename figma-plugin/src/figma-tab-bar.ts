import {FigmaNode} from './figma-node';
import {Tab, TabBar} from '@modern-ui-to-figma/elements';
import {addChild, compTabBar, viewportWidth} from './figma-main';

export class FigmaTabBar extends FigmaNode {
    constructor(tabBar: TabBar, width = 0) {
        super('TabBar', 'FRAME', width == 0 ? viewportWidth : width);
        this.tryToFind = false;
        this.acuElement = tabBar;

        const tabs = new FigmaNode('Tabs');
        tabs.tryToFind = false;
        tabs.componentNode = compTabBar;

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

        for (const child of tabBar.Children)
            addChild(this, tabBar.Type, child, width);
    }
}