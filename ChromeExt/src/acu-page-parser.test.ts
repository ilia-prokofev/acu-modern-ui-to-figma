import {AcuElement, AcuElementType} from "./elements/acu-element";
import ChildrenVisitor from "./visitors/children-visitors";
import QPGridVisitor from "./visitors/qp-grid-visitor";
import QPTabBarVisitor from "./visitors/qp-tab-bar-visitor";
import * as fs from "node:fs";
import QPToolBarVisitor from "./visitors/qp-tool-bar-visitor";
import QPFilterBarVisitor from "./visitors/qp-filter-bar-visitor";
import {Root} from "./elements/qp-root";
import QPGridToolBarVisitor from "./visitors/qp-grid-tool-bar-visitor";
import QPFieldsetVisitor from "./visitors/qp-field-set-visitor";
import QPFieldContainerVisitor from "./visitors/qp-field-container-visitor";
import {Grid} from "./elements/qp-grid";
import QPGridFooterGIVisitor from "./visitors/qp-grid-footer-gi-visitor";
import QPGridFooterSimpleVisitor from "./visitors/qp-grid-footer-simple-visitor";
import {allVisitors} from "./visitors/all-visitors";
import QPFieldStatusVisitor from "./visitors/qp-field-status-visitor";
import QPFieldCheckboxVisitor from "./visitors/qp-field-checkbox-visitor";
import QPFieldButtonVisitor from "./visitors/qp-field-button-visitor";
import QpFieldRadioButtonVisitor from "./visitors/qp-field-radio-button-visitor";
import QPFieldSelectorVisitor from "./visitors/qp-field-selector-visitor";
import QPNoFieldSelectorVisitor from "./visitors/qp-field-no-label-selector-visitor";
import QPFieldMaskEditorElementVisitor from "./visitors/qp-field-mask-editor-element-visitor";
import QPFieldMaskEditorAttributeVisitor from "./visitors/qp-field-mask-editor-attribute-visitor";
import QPRichTextEditorVisitor from "./visitors/qp-rich-text-editor-visitor";
import QPImageViewVisitor from "./visitors/qp-image-view-visitor";

describe('acu-page-parser.test', () => {
    const createRoot = (): Root => {
        return {
            Type: AcuElementType.Root,
            Id: "Root",
            Children: [],
            Title: null,
            Caption: null,
            ToolBar: null,
        };
    }

    const createGrid = (): Grid => {
        return {
            Type: AcuElementType.Grid,
            Id: "Grid",
            Caption: null,
            Columns: [],
            ToolBar: null,
            Footer: null,
            Wrapped: false,
        }
    }

    interface testCase {
        testName: string;
        childrenVisitor: ChildrenVisitor;
        incomingHTMLFileName: string;
        expectedJSONFile: string;
        parent: AcuElement;
    }

    const testCases: testCase[] = [
        {
            testName: "screen/pm-3010pl",
            childrenVisitor: new ChildrenVisitor(allVisitors),
            incomingHTMLFileName: './test-cases/screens/pm-3010pl-input.html',
            expectedJSONFile: './test-cases/screens/pm-3010pl-output.json',
            parent: createRoot(),
        },
        {
            testName: "screen/sc-000001",
            childrenVisitor: new ChildrenVisitor(allVisitors),
            incomingHTMLFileName: './test-cases/screens/sc-000001-input.html',
            expectedJSONFile: './test-cases/screens/sc-000001-output.json',
            parent: createRoot(),
        },
        {
            testName: "screen/sc-000001-disabled",
            childrenVisitor: new ChildrenVisitor(allVisitors),
            incomingHTMLFileName: './test-cases/screens/sc-000001-disabled-fields-input.html',
            expectedJSONFile: './test-cases/screens/sc-000001-disabled-fields-output.json',
            parent: createRoot(),
        },
        {
            testName: "screen/po-301000-po-history-",
            childrenVisitor: new ChildrenVisitor(allVisitors),
            incomingHTMLFileName: './test-cases/screens/po-301000-po-history-input.html',
            expectedJSONFile: './test-cases/screens/po-301000-po-history-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/tool-bar",
            childrenVisitor: new ChildrenVisitor([new QPToolBarVisitor()]),
            incomingHTMLFileName: './test-cases/elements/tool-bar-input.html',
            expectedJSONFile: './test-cases/elements/tool-bar-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/grid-tool-bar",
            childrenVisitor: new ChildrenVisitor([new QPGridToolBarVisitor(), new QPToolBarVisitor()]),
            incomingHTMLFileName: './test-cases/elements/grid-tool-bar-input.html',
            expectedJSONFile: './test-cases/elements/grid-tool-bar-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/filter-bar",
            childrenVisitor: new ChildrenVisitor([new QPFilterBarVisitor()]),
            incomingHTMLFileName: './test-cases/elements/filter-bar-input.html',
            expectedJSONFile: './test-cases/elements/filter-bar-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/grid",
            childrenVisitor: new ChildrenVisitor([new QPGridVisitor()]),
            incomingHTMLFileName: './test-cases/elements/grid-input.html',
            expectedJSONFile: './test-cases/elements/grid-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/tab-bar",
            childrenVisitor: new ChildrenVisitor([new QPTabBarVisitor()]),
            incomingHTMLFileName: './test-cases/elements/tab-bar-input.html',
            expectedJSONFile: './test-cases/elements/tab-bar-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/checkbox-checked",
            childrenVisitor: new ChildrenVisitor([new QPFieldCheckboxVisitor()]),
            incomingHTMLFileName: './test-cases/elements/checkbox-checked-input.html',
            expectedJSONFile: './test-cases/elements/checkbox-checked-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/checkbox-unchecked",
            childrenVisitor: new ChildrenVisitor([new QPFieldCheckboxVisitor()]),
            incomingHTMLFileName: './test-cases/elements/checkbox-unchecked-input.html',
            expectedJSONFile: './test-cases/elements/checkbox-unchecked-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-set-blue",
            childrenVisitor: new ChildrenVisitor([new QPFieldsetVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-blue-input.html',
            expectedJSONFile: './test-cases/elements/field-set-blue-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-set-default",
            childrenVisitor: new ChildrenVisitor([new QPFieldsetVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-default-input.html',
            expectedJSONFile: './test-cases/elements/field-set-default-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-set-gray",
            childrenVisitor: new ChildrenVisitor([new QPFieldsetVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-gray-input.html',
            expectedJSONFile: './test-cases/elements/field-set-gray-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-set-button",
            childrenVisitor: new ChildrenVisitor([new QPFieldButtonVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-button-input.html',
            expectedJSONFile: './test-cases/elements/field-set-button-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-set-statuses",
            childrenVisitor: new ChildrenVisitor([new QPFieldsetVisitor(), new QPFieldStatusVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-statuses-input.html',
            expectedJSONFile: './test-cases/elements/field-set-statuses-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-set-radio",
            childrenVisitor: new ChildrenVisitor([new QPFieldsetVisitor(), new QpFieldRadioButtonVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-radio-input.html',
            expectedJSONFile: './test-cases/elements/field-set-radio-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-set-check-box-container",
            childrenVisitor: new ChildrenVisitor([new QPFieldContainerVisitor(), new QPFieldCheckboxVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-check-box-container-input.html',
            expectedJSONFile: './test-cases/elements/field-set-check-box-container-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-mandatory",
            childrenVisitor: new ChildrenVisitor([new QPFieldSelectorVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-mandatory-input.html',
            expectedJSONFile: './test-cases/elements/field-mandatory-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-with-selector-and-checkbox",
            childrenVisitor: new ChildrenVisitor([
                new QPFieldContainerVisitor(),
                new QPNoFieldSelectorVisitor(),
                new QPFieldCheckboxVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-with-selector-and-checkbox-input.html',
            expectedJSONFile: './test-cases/elements/field-with-selector-and-checkbox-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-mask-editor-element",
            childrenVisitor: new ChildrenVisitor([new QPFieldMaskEditorElementVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-mask-editor-element-input.html',
            expectedJSONFile: './test-cases/elements/field-set-mask-editor-element-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/field-mask-editor-attribute",
            childrenVisitor: new ChildrenVisitor([new QPFieldMaskEditorAttributeVisitor()]),
            incomingHTMLFileName: './test-cases/elements/field-set-mask-editor-attribute-input.html',
            expectedJSONFile: './test-cases/elements/field-set-mask-editor-attribute-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/grid-footer-gi",
            childrenVisitor: new ChildrenVisitor([new QPGridFooterGIVisitor()]),
            incomingHTMLFileName: './test-cases/elements/grid-footer-gi-input.html',
            expectedJSONFile: './test-cases/elements/grid-footer-gi-output.json',
            parent: createGrid(),
        },
        {
            testName: "elements/grid-footer-simple",
            childrenVisitor: new ChildrenVisitor([new QPGridFooterSimpleVisitor()]),
            incomingHTMLFileName: './test-cases/elements/grid-footer-simple-input.html',
            expectedJSONFile: './test-cases/elements/grid-footer-simple-output.json',
            parent: createGrid(),
        },
        {
            testName: "elements/grid-caption",
            childrenVisitor: new ChildrenVisitor([new QPGridVisitor()]),
            incomingHTMLFileName: './test-cases/elements/grid-caption-input.html',
            expectedJSONFile: './test-cases/elements/grid-caption-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/rich-text-editor",
            childrenVisitor: new ChildrenVisitor([new QPRichTextEditorVisitor()]),
            incomingHTMLFileName: './test-cases/elements/rich-text-editor-input.html',
            expectedJSONFile: './test-cases/elements/rich-text-editor-output.json',
            parent: createRoot(),
        },
        {
            testName: "elements/image-view",
            childrenVisitor: new ChildrenVisitor([new QPImageViewVisitor()]),
            incomingHTMLFileName: './test-cases/elements/image-view-input.html',
            expectedJSONFile: './test-cases/elements/image-view-output.json',
            parent: createRoot(),
        },
    ]

    it.each(testCases)(
        '$testName',
        async ({incomingHTMLFileName, expectedJSONFile, childrenVisitor, parent}) => {
            const incomingHTML = fs.readFileSync(incomingHTMLFileName, 'utf8');
            const expectedJSON = fs.readFileSync(expectedJSONFile, 'utf8');

            const parser = new DOMParser();
            const doc = parser.parseFromString(incomingHTML, 'text/html');

            childrenVisitor.visit(doc.body.children[0], parent);

            const expected = JSON.parse(expectedJSON);
            expect(parent).toEqual(expected);
        }
    );
});
