import {FigmaNode} from "./figma-node";
import {Grid, GridColumnType} from "./elements/qp-grid";
import {figmaToolbar} from "./figma-toolbar";
import {compGrid, logger, viewportWidth} from "./figma-main";

export class figmaGrid extends FigmaNode {

    columnTypes = new Map<GridColumnType, string>([
        [GridColumnType.Settings, 'Settings'],
        [GridColumnType.Files, 'Files'],
        [GridColumnType.Notes, 'Notes'],
        [GridColumnType.Text, 'Text'],
        [GridColumnType.Link, 'Link'],
        [GridColumnType.Checkbox, 'Checkboxes with Text Header']
    ]);

    constructor(grid: Grid, name: string, newInstance: boolean) {
        super(name);
        this.tryToFind = !newInstance;
        this.acuElement = grid;
        this.componentProperties['Wrapped'] = grid.Wrapped ? 'Yes' : 'No';

        if (grid.Caption != null) {
            this.componentProperties['👁 Caption#5610:0'] = true;
            if (grid.Wrapped) {
                const caption = new FigmaNode('Group Header');
                caption.componentProperties['Text Value ▶#4494:3'] = grid.Caption!;
                this.children.push(caption);
            } else {
                const caption = new FigmaNode('Caption');
                caption.componentProperties['Text Value ▶#4494:3'] = grid.Caption!;
                this.children.push(caption);
            }
        }

        if (newInstance) {
            this.componentNode = compGrid;
            this.width = viewportWidth;
        }

        this.componentProperties['👁 Header#6826:0'] = true;
        if (grid.Footer) {
            this.componentProperties['👁 Footer#4741:54'] = true;
            const footer = new FigmaNode('Grid Footer');
            footer.componentProperties['Type'] = grid.Footer.FooterType;
            this.children.push(footer);
        }

        let displayedRows = 0;
        const displayedColumns = 12;
        const displayedRowsDefault = 5;
        const displayedRowsMax = 10;
        const displayedColumnsDefault = 10;

        const visibleColumns = Math.min(displayedColumns, grid.Columns.length);

        for (let i = 1; i <= visibleColumns; i++) {
            const column = grid.Columns[i - 1];
            displayedRows = Math.max(displayedRows, column.Cells.length);
            if (displayedRows >= displayedRowsMax) {
                displayedRows = displayedRowsMax;
                break;
            }
        }

        if (grid.ToolBar)
            this.children.push(new figmaToolbar(grid.ToolBar));

        let columnNumber = 1;

        for (let i = 1; i <= visibleColumns; i++) {
            const column = grid.Columns[i - 1];
            let columnInstance = new FigmaNode(`Grid Column ${columnNumber++}`);

            if (!this.columnTypes.has(column.ColumnType))
                logger.Warn(`${this.columnTypes} column type is not supported`, this.acuElement.Id, this);
            else
                columnInstance.componentProperties['Type'] = this.columnTypes.get(column.ColumnType)!;

            columnInstance.properties['visible'] = true;
            columnInstance.properties['counterAxisSizingMode'] = 'AUTO';

            if (column.ColumnType == GridColumnType.Settings ||
                column.ColumnType == GridColumnType.Notes ||
                column.ColumnType == GridColumnType.Files)
                columnInstance.properties['layoutGrow'] = 0;
            else
                columnInstance.properties['layoutGrow'] = 1;

            if (column.ColumnType == GridColumnType.Settings)
                continue;

            columnInstance.componentProperties['Alignment'] = (column.Alignment == 'Right' ? 'Right' : 'Left');
            this.children.push(columnInstance);

            for (let j = displayedRowsDefault; j < displayedRows; j++) {
                const cell = new FigmaNode(`Cell ${j + 1}`);
                cell.childIndex = j + 1;
                cell.componentProperties['Show Value#4709:42'] = true;
                columnInstance.children.push(cell);
            }

            for (let j = displayedRows; j < displayedRowsDefault; j++) {
                const cell = new FigmaNode(`Cell ${j + 1}`);
                cell.childIndex = j + 1;
                cell.componentProperties['Show Value#4709:42'] = false;
                columnInstance.children.push(cell);
            }

            if (column.ColumnType == GridColumnType.Notes || column.ColumnType == GridColumnType.Files)
                continue;

            const header = new FigmaNode('Column Header');
            header.childIndex = 0;
            header.componentProperties['Value#6706:49'] = column.Label;
            columnInstance.children.push(header);

            for (let j = 0; j < column.Cells.length; j++) {
                const cell = new FigmaNode(`Cell ${j + 1}`);
                cell.childIndex = j + 1;
                if (column.ColumnType == GridColumnType.Checkbox) {
                    if (column.Cells[j] == 'true') {
                        const checkbox = new FigmaNode(`Checkbox Indicator`);
                        checkbox.componentProperties['Selected'] = true;
                        cell.children.push(checkbox);
                    }
                } else
                    cell.componentProperties['Value#6706:0'] = column.Cells[j];
                columnInstance.children.push(cell);
            }

            for (let j = column.Cells.length; j < displayedRows; j++) {
                const cell = new FigmaNode(`Cell ${j + 1}`);
                cell.childIndex = j + 1;
                cell.componentProperties['Value#6706:0'] = '';
                columnInstance.children.push(cell);
            }
        }

        for (let i = columnNumber; i <= displayedColumnsDefault; i++) {
            const gridColumn = new FigmaNode(`Grid Column ${i}`);
            gridColumn.properties['visible'] = false;
            this.children.push(gridColumn);
        }

        if (columnNumber > 10) {
            const gridColumn = new FigmaNode(`Grid Column 20`);
            gridColumn.properties['visible'] = false;
            this.children.push(gridColumn);
        }
    }
}