import {FigmaNode} from './figma-node';
import {QPFieldset} from '@modern-ui-to-figma/elements';
import {AcuElementType} from '@modern-ui-to-figma/elements';
import {Grid} from '@modern-ui-to-figma/elements';
import {QPField} from '@modern-ui-to-figma/elements';
import {LabelLength} from '@modern-ui-to-figma/elements';
import {compFieldset} from './figma-main';
import {FigmaGrid} from './figma-grid';
import {FigmaRow} from './figma-row';

export class FigmaFieldSet extends FigmaNode {

    static showRowPropNames = [
        'Show Row 1#5419:15',
        'Show Row 2#5419:17',
        'Show Row 3#5419:19',
        'Show Row 4#5419:13',
        'Show Row 5#5419:11',
        'Show Row 6#5419:9',
        'Show Row 7#5419:8',
        'Show Row 8#5419:7',
        'Show Row 9#5419:5',
        'Show Row 10#5419:12'
    ];

    constructor(fs: QPFieldset, width = 0, labelLength: LabelLength = LabelLength.s) {
        super('FieldSet', 'INSTANCE', width);
        this.tryToFind = false;
        this.componentNode = compFieldset;
        this.acuElement = fs;

        const showHeader = (fs.Label != '' && fs.Label != null)
        this.componentProperties['Show Group Header#6619:0'] = showHeader;
        if (showHeader) {
            const child = new FigmaNode('Group Header');
            child.componentProperties['Text Value ▶#4494:3'] = fs.Label ?? '';
            this.children.push(child);
        }

        this.componentProperties['Wrapping'] = fs.Style;
        this.componentProperties['Label Length'] = labelLength;

        let rowNumber = 0;
        for (const child of fs.Children) {
            if (child.Type == AcuElementType.Grid) {
                this.componentProperties['Show grid#5425:0'] = true;
                this.children.push(new FigmaGrid(child as unknown as Grid, 'Grid', false));
            } else
                this.children.push(new FigmaRow(child as QPField, `Row ${++rowNumber}`, this));

            if (rowNumber == 10)
                break;
        }

        for (let i = 0; i < FigmaFieldSet.showRowPropNames.length; i++)
            this.componentProperties[FigmaFieldSet.showRowPropNames[i]] = (rowNumber > i);

    }
}