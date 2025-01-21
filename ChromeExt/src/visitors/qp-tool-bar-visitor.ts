import ElementVisitor from "./qp-element-visitor";
import {AcuElement, AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import {AcuContainer} from "../elements/acu-container";
import {
    QPToolBar,
    QPToolBarItem, QPToolBarItemButton,
    QPToolBarItemIconButton,
    QPToolBarItemIconButtonType,
    QPToolBarItemType, QPToolBarType
} from "../elements/qp-toolbar";
import {findClasses, findElementByClassesDown, findElementByNodeNameDown} from "./html-element-utils";

export default class QPToolBarVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        const gridToolBar = findClasses(htmlElement, "grid-top-bar");
        if (!gridToolBar && htmlElement.nodeName.toLowerCase() !== "qp-tool-bar") {
            return false;
        }

        let qpToolBarElement = htmlElement;
        if (gridToolBar) {
            const maybeQPToolBarElement = findElementByNodeNameDown(htmlElement, "qp-tool-bar");
            if (!maybeQPToolBarElement) {
                return false;
            }
            qpToolBarElement = maybeQPToolBarElement;
        }

        const toolBar = this.visitToolBar(qpToolBarElement);
        if (!toolBar) {
            return false;
        }

        this.visitToolBarSearch(htmlElement, toolBar);

        (parent as AcuContainer).Children.push(toolBar);

        allVisitor.visitChildren(htmlElement, parent);

        return true;
    }

    visitToolBar(htmlElement: Element): QPToolBar | null {
        const divElement = findElementByNodeNameDown(htmlElement, "div");
        if (!divElement) {
            return null;
        }

        const toolBar: QPToolBar = {
            Type: AcuElementType.ToolBar,
            ToolBarType: QPToolBarType.List,
            Items: [],
            ShowRightAction: false,
            ShowSaveButton: false,
        };

        for (const toolBarElement of divElement.children) {
            if (toolBarElement) {
                switch (toolBarElement.nodeName.toLowerCase()) {
                    case "ul": {
                        for (const ilElement of toolBarElement.children) {
                            const toolBarItem = this.getToolBarItemFromILElement(ilElement);
                            if (toolBarItem) {
                                toolBar.Items.push(toolBarItem);
                            }
                        }
                        break;
                    }
                    case "div": {
                        const toolBarItem = this.getToolBarItemFromDivElement(divElement);
                        if (toolBarItem) {
                            toolBar.Items.push(toolBarItem);
                        }
                        break;
                    }
                }
            }
        }

        return toolBar;
    }

    visitToolBarSearch(htmlElement: Element, toolBar: QPToolBar) {
        if (findElementByNodeNameDown(htmlElement, "qp-filter-box")) {
            toolBar.ShowRightAction = true;
        }
    }

    getToolBarItemFromILElement(ilElement: Element): QPToolBarItem | null {
        const id = ilElement.getAttribute("id") ?? "";
        if (id == "") {
            return null;
        }

        if (findClasses(ilElement, "minor-button")) {
            return this.createIconButton(ilElement);
        }

        const textElement = findElementByClassesDown(ilElement, "qp-tool-bar-text");
        if (textElement) {
            return {
                ItemType: QPToolBarItemType.Button,
                Text: textElement.textContent?.trim() ?? "",
            } as QPToolBarItemButton;
        }

        return null;
    }

    createIconButton(ilElement: Element): QPToolBarItemIconButton | null {
        const id = ilElement.getAttribute("id")?.toLowerCase();
        if (!id) {
            return null;
        }

        if (id.includes("refresh")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Refresh,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("cancelclosetolist")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Back,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("saveclosetolist")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.SaveAndBack,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("save")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Save,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("cancel")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Undo,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("insert")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Insert,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("edit")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Edit,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("adjust")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.AdjustColumns,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("exporttoexcel")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.ExportToExcel,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("import")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Import,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("delete")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Delete,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("copypaste")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Copy,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("first")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.First,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("previous")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Previous,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("next")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Next,
            } as QPToolBarItemIconButton;
        }

        if (id.includes("last")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.Last,
            } as QPToolBarItemIconButton;
        }

        return null;
    }

    getToolBarItemFromDivElement(divElement: Element): QPToolBarItem | null {
        const id = divElement.getAttribute("id");
        if (!id) {
            return null;
        }

        if (id.includes("menuopener")) {
            return {
                ItemType: QPToolBarItemType.IconButton,
                IconType: QPToolBarItemIconButtonType.MenuOpener,
            } as QPToolBarItemIconButton;
        }

        return null;
    }
}