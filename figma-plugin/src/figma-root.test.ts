import * as fs from 'node:fs';
import {Root} from '@modern-ui-to-figma/elements';
import {describe, it, expect} from 'vitest';

import {FigmaRoot} from './figma-root';

describe('figma-root', () => {

    const inputFolder = './src/test-cases/input/';
    const outputFolder = './src/test-cases/output/';
    const actualFolder = './src/test-cases/actual/';

    interface testCase {
        testName: string;
    }

    const testCases: testCase[] = [
        {testName: 'toolbar'},
        {testName: 'IN202500'},
        {testName: 'PM301000-summary'},
        {testName: 'PO301000-po-history'},
        {testName: 'PR209800'},
        {testName: 'SC301000-addresses'},
        {testName: 'SC301000-details'},
        {testName: 'SC301000-financial'},
        {testName: 'SC301000-taxes'},
        {testName: 'SM208000-navigation'},
    ]

    it.each(testCases)(
        '$testName',
        ({testName}: testCase): void => {
            const incomingJSON = fs.readFileSync(`${inputFolder}${testName}.json`, 'utf8');
            const expectedJSON = fs.readFileSync(`${outputFolder}${testName}.json`, 'utf8');

            const root = JSON.parse(incomingJSON) as Root;
            const actual = new FigmaRoot(root);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const expected = JSON.parse(expectedJSON);
            // fs.writeFileSync(`${actualFolder}${testName}.json`, JSON.stringify(actual, null, 2));
            expect(JSON.parse(JSON.stringify(actual))).toEqual(expected);
        }
    );
})