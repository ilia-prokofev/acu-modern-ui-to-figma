import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {Grid, GridColumn, GridColumnType} from "../elements/qp-grid";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {findElementByClassesDown, findElementByNodeNameDown} from "./html-element-utils";

export default class QPGridVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-grid") {
            return false;
        }

        const child: Grid = {
            Type: AcuElementType.Grid,
            Columns: [],
        };

        (parent as AcuContainer).Children.push(child);

        this.setupCells(child, htmlElement);

        allVisitor.visitChildren(htmlElement, child);

        return true;
    }

    setupCells(grid: Grid, htmlElement: Element) {
        const tHeadElement = findElementByNodeNameDown(htmlElement, "thead");
        if (!tHeadElement) {
            return;
        }

        const tBodyElement = findElementByNodeNameDown(htmlElement, "tbody");
        if (!tBodyElement) {
            return;
        }

        const row = tHeadElement.children[0]; // Первый дочерний элемент
        for (let i = 0; i < row.children.length; i++) {
            const thElement = row.children[i];
            let columnType = this.getIconColumnType(thElement);
            if (!columnType) {
                columnType = this.getColumnByCellValue(tBodyElement, i)
            }

            const columnLabelElement = findElementByClassesDown(thElement, 'grid-header-text');
            const cellValues = this.getCellValues(tBodyElement, i);

            const child: GridColumn = {
                Type: AcuElementType.GridColumn,
                Label: columnLabelElement?.textContent?.trim() ?? '',
                ColumnType: columnType ?? GridColumnType.Text,
                Cells: cellValues,
                Alignment: null,
            };

            grid.Columns.push(child);
        }
    }

    getIconColumnType(thElement: Element): GridColumnType | null {
        const useElement = findElementByNodeNameDown(thElement, "use");
        if (!useElement) {
            return null;
        }

        const hrefAttribute = useElement?.getAttribute("href");
        if (!hrefAttribute) {
            return null;
        }

        if (hrefAttribute.toLowerCase().includes("setting")) {
            return GridColumnType.Settings;
        }

        if (hrefAttribute.toLowerCase().includes("file")) {
            return GridColumnType.Files;
        }

        if (hrefAttribute.toLowerCase().includes("note")) {
            return GridColumnType.Notes;
        }

        return null;
    }

    getColumnByCellValue(tBodyElement: Element, columnIndex: number): GridColumnType {
        for (const trElement of tBodyElement.children) {
            if (trElement.children.length <= columnIndex) {
                continue;
            }

            const tdElement = trElement.children[columnIndex];

            const cellContentElement = findElementByClassesDown(tdElement, "cell-content");
            if (!cellContentElement || cellContentElement.children.length === 0) {
                continue;
            }

            switch (cellContentElement.children[0].nodeName.toLowerCase()) {
                case "a":
                    return GridColumnType.Link;
                case "i":
                    return GridColumnType.Checkbox;
                default:
                    return GridColumnType.Text;
            }
        }

        return GridColumnType.Text;
    }

    getCellValues(tBodyElement: Element, columnIndex: number): Array<string> {
        const values: Array<string> = [];

        for (const trElement of tBodyElement.children) {
            if (trElement.children.length <= columnIndex) {
                continue;
            }

            const tdElement = trElement.children[columnIndex];

            const cellContentElement = findElementByClassesDown(tdElement, "cell-content");
            if (!cellContentElement || cellContentElement.children.length < 1) {
                continue;
            }

            switch (cellContentElement.children[0].nodeName.toLowerCase()) {
                case "a":
                case "span":
                    values.push(cellContentElement.children[0].textContent?.trim() ?? "");
            }
        }

        return values;
    }
}