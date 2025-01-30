import {describe, expect, it} from 'vitest';
import * as fs from 'node:fs';
import {AcuPageParser} from '../../chrome-extension/src/acu-page-parser'
import {Root} from '@modern-ui-to-figma/elements';
import ChildrenVisitor from '../../chrome-extension/src/visitors/children-visitors';
import {createAllVisitors} from '../../chrome-extension/src/visitors/all-visitors';
import {figmaRoot} from '../../figma-plugin/src/figma-root'

describe('integration', () => {
    interface testCase {
        testName: string
        incomingHTMLFileName: string
        expectedJSONFile: string
    }

    const testCases: testCase[] = [
        {
            testName: 'pm301000',
            incomingHTMLFileName: './src/pm301000-input.html',
            expectedJSONFile: './src/pm301000-output.json',
        }
    ]

    it.each(testCases)('$testName', ({incomingHTMLFileName, expectedJSONFile}) => {
        const incomingHTML = fs.readFileSync(incomingHTMLFileName, 'utf8');
        const expectedJSON = fs.readFileSync(expectedJSONFile, 'utf8');

        const childrenVisitor = new ChildrenVisitor();
        const allVisitors = createAllVisitors(childrenVisitor);
        childrenVisitor.populate(allVisitors);
        const parser = new AcuPageParser(childrenVisitor);

        const root = parser.parse(incomingHTML) as Root;
        expect(root).not.equal(null);

        const fRoot = new figmaRoot(root);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const expected = JSON.parse(expectedJSON);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const actual = JSON.parse(JSON.stringify(fRoot));
        expect(actual).toEqual(expected);
    });
})
