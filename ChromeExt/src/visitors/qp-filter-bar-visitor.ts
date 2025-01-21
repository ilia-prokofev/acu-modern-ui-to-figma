import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import ElementVisitor from "./qp-element-visitor";
import {AcuContainer} from "../elements/acu-container";
import {
    QPToolBar,
    QPToolBarItem,
    QPToolBarItemAddFilterButton,
    QPToolBarItemFilterButton,
    QPToolBarItemFilterCombo,
    QPToolBarItemMenuButton,
    QPToolBarItemSeparator,
    QPToolBarItemType,
    QPToolBarType
} from "../elements/qp-toolbar";
import {findClasses, findElementByClassesDown, findElementByNodeNameDown} from "./html-element-utils";

export default class QpFilterBarVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-filter-bar") {
            return false;
        }

        const itemsElement = findElementByClassesDown(htmlElement, "filters-strip");
        if (!itemsElement) {
            return false;
        }

        const toolBar = this.visitItems(itemsElement);

        this.visitToolBarSearch(htmlElement, toolBar);

        (parent as AcuContainer).Children.push(toolBar);

        allVisitor.visitChildren(htmlElement, toolBar);

        return true;
    }

    visitItems(itemsElement: Element): QPToolBar {
        const toolBar: QPToolBar = {
            Type: AcuElementType.ToolBar,
            ToolBarType: QPToolBarType.FilterBar,
            Items: [],
            ShowRightAction: false,
            ShowSaveButton: false,
        };

        for (const itemElement of itemsElement.children) {
            const toolBarItem = this.createItem(itemElement);
            if (toolBarItem) {
                toolBar.Items.push(toolBarItem);
            }
        }

        return toolBar;
    }

    createItem(itemElement: Element): QPToolBarItem | null {
        if (findClasses(itemElement, "filter-separator")) {
            return {
                ItemType: QPToolBarItemType.Separator,
            } as QPToolBarItemSeparator;
        }

        switch (itemElement.nodeName.toLowerCase()) {
            case "qp-filter-combo": {
                const textElement = findElementByClassesDown(itemElement, "text");
                return {
                    ItemType: QPToolBarItemType.FilterCombo,
                    Text: textElement?.textContent?.trim() ?? "",
                } as QPToolBarItemFilterCombo;
            }

            case "qp-filter-button": {
                const textElement = findElementByClassesDown(itemElement, "text");
                return {
                    ItemType: QPToolBarItemType.FilterButton,
                    Text: textElement?.textContent?.trim() ?? "",
                } as QPToolBarItemFilterButton;
            }

            case "qp-button": {
                if (findClasses(itemElement, "aurelia-hide")) {
                    return null;
                }

                if (findClasses(itemElement, "add-filter")) {
                    return {
                        ItemType: QPToolBarItemType.AddFilterButton,
                    } as QPToolBarItemAddFilterButton
                }

                return null;
            }

            case "qp-menu": {
                return {
                    ItemType: QPToolBarItemType.MenuButton,
                } as QPToolBarItemMenuButton;
            }
        }

        return null;
    }

    visitToolBarSearch(htmlElement: Element, toolBar: QPToolBar) {
        if (findElementByClassesDown(htmlElement, "filter-box-wrap")) {
            toolBar.ShowRightAction = true;
        }
    }
}