import {AcuPageParser} from "./acu-page-parser";
import * as fs from "node:fs";
import {AcuElement} from "./elements/acu-element";

describe('acu-page-parser', () => {
    interface testCase {
        testName: string;
        incomingHTMLFileName: string;
        expectedJSONFile: string;
    }

    const testCases: testCase[] = [
        {
            testName: "pm-3010pl",
            incomingHTMLFileName: './test-cases/pm-3010pl-input.html',
            expectedJSONFile: './test-cases/pm-3010pl-output.json',
        },
        // {
        //     testName: "sc-000001",
        //     incomingHTMLFileName: './test-cases/sc-000001-input.html',
        //     expectedJSONFile: './test-cases/sc-000001-output.json',
        // },
    ]

    it.each(testCases)(
        '$testName',
        async ({incomingHTMLFileName, expectedJSONFile}) => {
            const incomingHTML = fs.readFileSync(incomingHTMLFileName, 'utf8');
            const expectedJSON = fs.readFileSync(expectedJSONFile, 'utf8');

            const sut = new AcuPageParser();

            const actual = sut.parse(incomingHTML);

            const expected = JSON.parse(expectedJSON) as AcuElement;
            expect(actual).toEqual(expected);
        }
    );
});