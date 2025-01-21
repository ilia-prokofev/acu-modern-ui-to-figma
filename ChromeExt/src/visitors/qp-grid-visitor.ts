import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {Grid, GridColumn, GridColumnType} from "../elements/qp-grid";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {
    findElementByClassesDown,
    findElementByNodeNameDown,
    getElementAlignment,
    innerTextContent
} from "./html-element-utils";
import {AcuAlignment} from "../elements/acu-alignment";

const checkedClass = "control-GridCheck"
const uncheckedClass = "control-GridUncheck"

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

            const columnLabelElement = findElementByClassesDown(thElement, 'grid-header-text');
            const label = columnLabelElement?.textContent?.trim() ?? '';

            let columnType = this.getIconColumnType(thElement);
            if (!columnType) {
                columnType = this.getColumnTypeByCellValue(tBodyElement, i)
            }

            const cellValues = this.getCellValues(tBodyElement, i);
            const alignment = this.getColumnAlignmentByCellValue(tBodyElement, i);

            const child: GridColumn = {
                Type: AcuElementType.GridColumn,
                Label: label,
                ColumnType: columnType,
                Cells: cellValues,
                Alignment: alignment,
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

    getColumnTypeByCellValue(tBodyElement: Element, columnIndex: number): GridColumnType {
        for (const trElement of tBodyElement.children) {
            if (trElement.children.length <= columnIndex) {
                continue;
            }

            const tdElement = trElement.children[columnIndex];

            if (findElementByClassesDown(tdElement, checkedClass) ||
                findElementByClassesDown(tdElement, uncheckedClass)) {
                return GridColumnType.Checkbox;
            }

            if (findElementByNodeNameDown(tdElement, "a")) {
                return GridColumnType.Link;
            }
        }

        return GridColumnType.Text;
    }

    getColumnAlignmentByCellValue(tBodyElement: Element, columnIndex: number): AcuAlignment {
        for (const trElement of tBodyElement.children) {
            if (trElement.children.length <= columnIndex) {
                continue;
            }

            const tdElement = trElement.children[columnIndex];
            const alignment = getElementAlignment(tdElement);
            if (alignment) {
                return alignment;
            }
        }

        return AcuAlignment.Left;
    }

    getCellValues(tBodyElement: Element, columnIndex: number): Array<string> {
        const values: Array<string> = [];

        for (const trElement of tBodyElement.children) {
            if (trElement.children.length <= columnIndex) {
                continue;
            }

            const tdElement = trElement.children[columnIndex];

            const checked = findElementByClassesDown(tdElement, checkedClass)
            if (checked) {
                values.push("true");
                continue;
            }

            const unchecked = findElementByClassesDown(tdElement, uncheckedClass);
            if (unchecked) {
                values.push("false");
                continue;
            }

            const textContent = innerTextContent(tdElement)?.trim() ?? "";
            values.push(textContent);
        }

        return values;
    }
}