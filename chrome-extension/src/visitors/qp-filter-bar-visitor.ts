import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";
import ElementVisitor from "./qp-element-visitor";
import {
    isQPToolbarContainer,
    QPToolBar,
    QPToolbarContainer,
    QPToolBarItem,
    QPToolBarItemButton,
    QPToolBarItemFilterButton,
    QPToolBarItemFilterCombo,
    QPToolBarItemSeparator,
    QPToolBarItemType,
    QPToolBarType,
} from "@modern-ui-to-figma/elements";
import {
    concatElementID,
    findClasses,
    findElementByClassesDown,
    isHiddenElement
} from "./html-element-utils";
import {ButtonStyle} from "@modern-ui-to-figma/elements";
import {parseButton} from "./button-utils";

export default class QPFilterBarVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!isQPToolbarContainer(parent)) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-filter-bar") {
            return false;
        }

        const itemsElement = findElementByClassesDown(htmlElement, "filters-strip");
        if (!itemsElement) {
            return false;
        }

        const toolBarContainer = (parent);
        if (toolBarContainer.ToolBar) {
            // already exists. Just ignore it (carefully)
            return false;
        }

        const toolBar: QPToolBar = {
            Type: AcuElementType.ToolBar,
            Id: concatElementID(parent.Id, htmlElement),
            ToolBarType: QPToolBarType.FilterBar,
            Items: [],
            ShowRightAction: false,
            ShowSaveButton: false,
        };

        this.visitItems(itemsElement, toolBar);
        this.visitToolBarSearch(htmlElement, toolBar);
        if (toolBar.Items.length === 0) {
            return false;
        }

        toolBarContainer.ToolBar = toolBar;
        return true;
    }

    visitItems(itemsElement: Element, toolBar: QPToolBar) {
        for (const itemElement of itemsElement.children) {
            if (isHiddenElement(itemElement)) {
                continue
            }
            const toolBarItem = this.createItem(itemElement);
            if (toolBarItem) {
                toolBar.Items.push(toolBarItem);
            }
        }
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
                const button = parseButton(itemElement);
                return {
                    ItemType: QPToolBarItemType.Button,
                    Style: ButtonStyle.Secondary,
                    Enabled: button.Enabled,
                    Text: button.Text,
                    Icon: button.Icon,
                } as QPToolBarItemButton;
            }

            case "qp-menu": {
                const button = parseButton(itemElement);
                return {
                    ItemType: QPToolBarItemType.Button,
                    Style: ButtonStyle.Tertiary,
                    Enabled: button.Enabled,
                    Text: button.Text,
                    Icon: button.Icon,
                } as QPToolBarItemButton;
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