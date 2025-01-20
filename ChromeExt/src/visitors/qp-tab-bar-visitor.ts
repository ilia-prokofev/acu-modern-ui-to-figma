import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {Tab, TabBar} from "../elements/qp-tabbar";
import ElementVisitor from "./qp-element-visitor";
import {findClasses, findElementByClassesDown} from "./html-element-utils";
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

        const child: TabBar = {
            Type: AcuElementType.Tabbar,
            Children: [],
            Tabs: [],
        };

        const tabsContainer = findElementByClassesDown(htmlElement, 'qp-tabbar-wrapper', 'au-target');
        if (!tabsContainer) {
            return false;
        }

        for (let i = 0; i < tabsContainer.children.length; i++) {
            const tabElement = tabsContainer.children[i];
            if (!findClasses(tabElement, 'tab-header-container')) {
                continue;
            }

            if (tabElement.children.length === 0 ||
                tabElement.children[0].children.length === 0) {
                continue;
            }

            const tabLabelElement = tabElement.children[0].children[0];
            if (!findClasses(tabLabelElement, 'au-target')) {
                continue;
            }

            const tab: Tab = {
                Type: AcuElementType.Tab,
                Label: tabLabelElement.textContent?.trim() ?? '',
                IsActive: findClasses(tabElement, 'qp-tabbar-tab--first'),
            };

            child.Tabs.push(tab);
        }

        (parent as AcuContainer).Children.push(child);

        allVisitor.visitChildren(htmlElement, child);

        return true;
    }
}