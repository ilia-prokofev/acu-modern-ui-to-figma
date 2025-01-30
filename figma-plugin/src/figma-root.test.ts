import * as fs from 'node:fs';
import {Root} from '@modern-ui-to-figma/elements';
import {describe, it, expect} from 'vitest';

import {figmaRoot} from './figma-root';

describe('figma-root', () => {
    interface testCase {
        testName: string;
        incomingJSONFileName: string;
        expectedJSONFileName: string;
    }

    const testCases: testCase[] = [
        {
            testName: 'SC301000',
            incomingJSONFileName: './src/test-cases/SC301000-input.json',
            expectedJSONFileName: './src/test-cases/SC301000-output.json',
        },
        {
            testName: 'PM301000',
            incomingJSONFileName: './src/test-cases/PM301000-input.json',
            expectedJSONFileName: './src/test-cases/PM301000-output.json',
        },
    ]

    it.each(testCases)(
        '$testName',
        ({incomingJSONFileName, expectedJSONFileName}: testCase): void => {
            const incomingJSON = fs.readFileSync(incomingJSONFileName, 'utf8');
            const expectedJSON = fs.readFileSync(expectedJSONFileName, 'utf8');

            const root = JSON.parse(incomingJSON) as Root;
            const actual = new figmaRoot(root);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const expected = JSON.parse(expectedJSON);
            expect(JSON.parse(JSON.stringify(actual))).toEqual(expected);
        }
    );
})