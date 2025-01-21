import {AcuContainer} from "../elements/acu-container";
import {AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import ElementVisitor from "./qp-element-visitor";
import QPGridVisitor from "./qp-grid-visitor";
import QPTabBarVisitor from "./qp-tab-bar-visitor";
import * as fs from "node:fs";
import QPToolBarVisitor from "./qp-tool-bar-visitor";

describe('visitor', () => {
    interface testCase {
        testName: string;
        sut: ElementVisitor;
        incomingHTMLFileName: string;
        expectedJSONFileFile: string;
    }

    const testCases: testCase[] = [
        {
            testName: "tool-bar",
            sut: new QPToolBarVisitor(),
            incomingHTMLFileName: './visitors/qp-tool-bar-input.html',
            expectedJSONFileFile: './visitors/qp-tool-bar-output.json',
        },
        {
            testName: "grid-tool-bar",
            sut: new QPToolBarVisitor(),
            incomingHTMLFileName: './visitors/qp-grid-tool-bar-input.html',
            expectedJSONFileFile: './visitors/qp-grid-tool-bar-output.json',
        },
        {
            testName: "grid",
            sut: new QPGridVisitor(),
            incomingHTMLFileName: './visitors/qp-grid-visitor-input.html',
            expectedJSONFileFile: './visitors/qp-grid-visitor-output.json',
        },
        {
            testName: "tab-bar",
            sut: new QPTabBarVisitor(),
            incomingHTMLFileName: './visitors/qp-tab-bar-visitor-input.html',
            expectedJSONFileFile: './visitors/qp-tab-bar-visitor-output.json',
        },
    ]

    for (const testCase of testCases) {
        test(testCase.testName, () => {
            const incomingHTML = fs.readFileSync(testCase.incomingHTMLFileName, 'utf8');
            const expectedJSON = fs.readFileSync(testCase.expectedJSONFileFile, 'utf8');

            const parser = new DOMParser();
            const doc = parser.parseFromString(incomingHTML, 'text/html');

            const parent: AcuContainer = {
                Type: AcuElementType.Root,
                Children: [],
            }

            testCase.sut.visit(doc.body.children[0], parent, new ChildrenVisitor([]));

            const expected = JSON.parse(expectedJSON);
            expect(parent.Children[0]).toEqual(expected);
        });
    }
});
