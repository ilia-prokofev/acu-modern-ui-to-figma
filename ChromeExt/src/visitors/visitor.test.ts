import {AcuElementType} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";
import ElementVisitor from "./qp-element-visitor";
import QPGridVisitor from "./qp-grid-visitor";
import QPTabBarVisitor from "./qp-tab-bar-visitor";
import * as fs from "node:fs";
import QPToolBarVisitor from "./qp-tool-bar-visitor";
import QPFilterBarVisitor from "./qp-filter-bar-visitor";
import {Root} from "../elements/qp-root";
import QPGridToolBarVisitor from "./qp-grid-tool-bar-visitor";

describe('visitor', () => {
    interface testCase {
        testName: string;
        sut: ElementVisitor;
        childrenVisitor: ChildrenVisitor;
        incomingHTMLFileName: string;
        expectedJSONFile: string;
    }

    const testCases: testCase[] = [
        {
            testName: "tool-bar",
            sut: new QPToolBarVisitor(),
            childrenVisitor: new ChildrenVisitor([]),
            incomingHTMLFileName: './test-cases/tool-bar-input.html',
            expectedJSONFile: './test-cases/tool-bar-output.json',
        },
        {
            testName: "grid-tool-bar",
            sut: new QPGridToolBarVisitor(),
            childrenVisitor: new ChildrenVisitor([new QPToolBarVisitor()]),
            incomingHTMLFileName: './test-cases/grid-tool-bar-input.html',
            expectedJSONFile: './test-cases/grid-tool-bar-output.json',
        },
        {
            testName: "filter-bar",
            sut: new QPFilterBarVisitor(),
            childrenVisitor: new ChildrenVisitor([]),
            incomingHTMLFileName: './test-cases/filter-bar-input.html',
            expectedJSONFile: './test-cases/filter-bar-output.json',
        },
        {
            testName: "grid",
            sut: new QPGridVisitor(),
            childrenVisitor: new ChildrenVisitor([]),
            incomingHTMLFileName: './test-cases/grid-input.html',
            expectedJSONFile: './test-cases/grid-output.json',
        },
        {
            testName: "tab-bar",
            sut: new QPTabBarVisitor(),
            childrenVisitor: new ChildrenVisitor([]),
            incomingHTMLFileName: './test-cases/tab-bar-input.html',
            expectedJSONFile: './test-cases/tab-bar-output.json',
        },
    ]

    it.each(testCases)(
        '$testName',
        async ({sut, incomingHTMLFileName, expectedJSONFile, childrenVisitor}) => {
            const incomingHTML = fs.readFileSync(incomingHTMLFileName, 'utf8');
            const expectedJSON = fs.readFileSync(expectedJSONFile, 'utf8');

            const parser = new DOMParser();
            const doc = parser.parseFromString(incomingHTML, 'text/html');

            const parent: Root = {
                Type: AcuElementType.Root,
                Id: "Root",
                Children: [],
                Caption1: null,
                Caption2: null,
                ToolBar: null,
            };

            sut.visit(doc.body.children[0], parent, childrenVisitor);

            const expected = JSON.parse(expectedJSON);
            expect(parent).toEqual(expected);
        }
    );
});
