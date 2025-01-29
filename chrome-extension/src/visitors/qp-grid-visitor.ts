import {AcuElement, AcuElementType} from "@modern-ui-to-figma/elements";
import {AcuContainer} from "@modern-ui-to-figma/elements";
import {Grid, GridColumn, GridColumnType} from "@modern-ui-to-figma/elements";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {
    concatElementID, findClasses,
    findElementByClassesDown,
    findElementByNodeNameDown, findFirstLeafTextContent,
    getElementAlignment,
    innerTextContent
} from "./html-element-utils";
import {AcuAlignment} from "@modern-ui-to-figma/elements";

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

        const grid: Grid = {
            Type: AcuElementType.Grid,
            Id: concatElementID(parent.Id, htmlElement),
            Caption: this.parseCaption(htmlElement),
            ToolBar: null,
            Columns: [],
            Footer: null,
            Wrapped: findClasses(htmlElement, "framed-section"),
        };

        this.visitCells(grid, htmlElement);

        allVisitor.visitChildren(htmlElement, grid);
        (parent as AcuContainer).Children.push(grid);
        return true;
    }

    parseCaption(htmlElement: Element): string | null {
        const captionElement = findElementByClassesDown(htmlElement, "qp-caption");
        if (!captionElement) {
            return null;
        }

        return findFirstLeafTextContent(captionElement);
    }

    visitCells(grid: Grid, htmlElement: Element) {
        const tHeadElement = findElementByNodeNameDown(htmlElement, "thead");
        if (!tHeadElement) {
            return;
        }

        const tBodyElement = findElementByNodeNameDown(htmlElement, "tbody");
        if (!tBodyElement) {
            return;
        }

        const row = tHeadElement.children[0];
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

            let textContent: string | null = null;
            if (findElementByClassesDown(tdElement, checkedClass)) {
                textContent = "true";
            } else if (findElementByClassesDown(tdElement, uncheckedClass)) {
                textContent = "false";
            } else if (findElementByNodeNameDown(tdElement, "a")) {
                textContent = innerTextContent(tdElement);
            } else {
                const textElement = findElementByClassesDown(tdElement, "text");
                if (textElement) {
                    textContent = innerTextContent(textElement);
                }
            }

            values.push(textContent?.trim() ?? "");
        }

        return values;
    }
}