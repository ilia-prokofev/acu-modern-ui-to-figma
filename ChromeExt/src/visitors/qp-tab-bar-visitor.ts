import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {Tab, TabBar} from "../elements/qp-tabbar";
import ElementVisitor from "./qp-element-visitor";
import {findClasses, findElementByClassesDown, findElementByNodeNameDown} from "./html-element-utils";
import ChildrenVisitor from "./children-visitors";

export default class QPTabBarVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "div") {
            return false;
        }

        if (!findClasses(htmlElement, 'qp-tabbar', 'au-target')) {
            return false;
        }

        const tabBar: TabBar = {
            Type: AcuElementType.Tabbar,
            Children: [],
            Tabs: [],
        };

        const tabsContainer = findElementByClassesDown(htmlElement, 'qp-tabbar-wrapper', 'au-target');
        if (!tabsContainer) {
            return false;
        }

        for (let i = 0; i < tabsContainer.children.length; i++) {
            const tabHeaderContainer = tabsContainer.children[i];
            if (!findClasses(tabHeaderContainer, 'tab-header-container')) {
                continue;
            }

            const tabHeaderContainerChild = findElementByNodeNameDown(tabHeaderContainer, "div");
            if (!tabHeaderContainerChild) {
                continue;
            }

            const tabElement = findElementByNodeNameDown(tabHeaderContainerChild, "div")
            if (!tabElement) {
                continue;
            }

            const tab: Tab = {
                Type: AcuElementType.Tab,
                Label: tabElement.textContent?.trim() ?? '',
                IsActive: findElementByClassesDown(tabHeaderContainer, 'qp-tabbar-active') !== null,
            };

            tabBar.Tabs.push(tab);
        }

        (parent as AcuContainer).Children.push(tabBar);

        allVisitor.visitChildren(htmlElement, tabBar);

        return true;
    }
}