import * as fs from "node:fs";
import {Root} from "./elements/qp-root";

import {figmaRoot} from "./figma-root";

describe('figma-root', () => {
    interface testCase {
        testName: string;
        incomingJSONFileName: string;
        expectedJSONFileName: string;
    }
    const testCases: testCase[] = [
        {
            testName: "SC301000",
            incomingJSONFileName: './test-cases/SC301000-input.json',
            expectedJSONFileName: './test-cases/SC301000-output.json',
        },
        {
            testName: "PM301000",
            incomingJSONFileName: './test-cases/PM301000-input.json',
            expectedJSONFileName: './test-cases/PM301000-output.json',
        },
    ]

    it.each(testCases)(
        '$testName',
        async ({incomingJSONFileName, expectedJSONFileName}) => {
            const incomingJSON = fs.readFileSync(incomingJSONFileName, 'utf8');
            const expectedJSON = fs.readFileSync(expectedJSONFileName, 'utf8');

            const root = JSON.parse(incomingJSON) as Root;
            const actual = new figmaRoot(root);
            const expected = JSON.parse(expectedJSON);
            expect(JSON.parse(JSON.stringify(actual))).toEqual(expected);
        }
    );
})