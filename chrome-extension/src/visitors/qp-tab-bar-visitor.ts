import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import {AcuContainer} from "@modern-ui-to-figma/elements";
import {Tab, TabBar} from "@modern-ui-to-figma/elements";
import ElementVisitor from "./qp-element-visitor";
import {
    concatElementID,
    findClasses,
    findElementByClassesDown, findElementByNodeNameDown,
    findFirstLeafTextContent
} from "./html-element-utils";
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
            Id: concatElementID(parent.Id, htmlElement),
            Tabs: [],
            Children: [],
        };

        const tabsContainer = findElementByClassesDown(htmlElement, 'qp-tabbar-wrapper', 'au-target');
        if (!tabsContainer) {
            return false;
        }

        const header = findElementByClassesDown(htmlElement, 'qp-tabbar-wrapper');
        if (!header) {
            return false;
        }

        for (const tabHeader of header.children) {
            const tab: Tab = {
                Type: AcuElementType.Tab,
                Id: concatElementID(parent.Id, htmlElement),
                Label: findFirstLeafTextContent(tabHeader) ?? '',
                IsActive: findElementByClassesDown(tabHeader, 'qp-tabbar-active') !== null,
            };

            tabBar.Tabs.push(tab);

            if (tab.IsActive) {
                // suppose there is the only tab (after preprocessing)
                const tabElement = findElementByNodeNameDown(htmlElement, "qp-tab");
                if (tabElement) {
                    allVisitor.visitChildren(tabElement, tabBar);
                }
            }
        }

        (parent as AcuContainer).Children.push(tabBar);
        return true;
    }
}