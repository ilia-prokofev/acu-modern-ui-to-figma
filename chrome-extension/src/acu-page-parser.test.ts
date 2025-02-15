import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements';
import ChildrenVisitor from './visitors/children-visitors';
import QPGridVisitor from './visitors/qp-grid-visitor';
import QPTabBarVisitor from './visitors/qp-tab-bar-visitor';
import * as fs from 'node:fs';
import QPToolBarVisitor from './visitors/qp-tool-bar-visitor';
import QPFilterBarVisitor from './visitors/qp-filter-bar-visitor';
import { Root } from '@modern-ui-to-figma/elements';
import QPGridToolBarVisitor from './visitors/qp-grid-tool-bar-visitor';
import QPFieldsetVisitor from './visitors/qp-field-set-visitor';
import QPFieldContainerVisitor from './visitors/qp-field-container-visitor';
import { Grid } from '@modern-ui-to-figma/elements';
import QPGridFooterGIVisitor from './visitors/qp-grid-footer-gi-visitor';
import QPGridFooterSimpleVisitor from './visitors/qp-grid-footer-simple-visitor';
import QPFieldStatusVisitor from './visitors/qp-field-status-visitor';
import QPFieldCheckboxVisitor from './visitors/qp-field-checkbox-visitor';
import QPFieldButtonVisitor from './visitors/qp-field-button-visitor';
import QPFieldRadioButtonVisitor from './visitors/qp-field-radio-button-visitor';
import QPFieldSelectorVisitor from './visitors/qp-field-selector-visitor';
import QPNoFieldSelectorVisitor from './visitors/qp-field-no-label-selector-visitor';
import QPFieldMaskEditorElementVisitor from './visitors/qp-field-mask-editor-element-visitor';
import QPFieldMaskEditorAttributeVisitor from './visitors/qp-field-mask-editor-attribute-visitor';
import QPRichTextEditorVisitor from './visitors/qp-rich-text-editor-visitor';
import QPImageViewVisitor from './visitors/qp-image-view-visitor';
import QPTreeVisitor from './visitors/qp-tree-visitor';
import { describe, it, expect } from 'vitest';
import ElementVisitor from './visitors/qp-element-visitor';
import { createAllVisitors } from './visitors/all-visitors';

describe('acu-page-parser', () => {
    const createRoot = (): Root => {
        return {
            Type: AcuElementType.Root,
            Id: 'Root',
            Children: [],
            Title: null,
            Caption: null,
            ToolBar: null,
        };
    };

    const createGrid = (): Grid => {
        return {
            Type: AcuElementType.Grid,
            Id: 'Grid',
            Caption: null,
            Columns: [],
            ToolBar: null,
            Footer: null,
            Wrapped: false,
        };
    };

  interface testCase {
    testName: string
    visitorsFactory: (childrenVisitor: ChildrenVisitor) => ElementVisitor[]
    incomingHTMLFileName: string
    expectedJSONFile: string
    parent: AcuElement
  }

  const testCases: testCase[] = [
      {
          testName: 'screen/pm-3010pl',
          visitorsFactory: (childrenVisitor) => createAllVisitors(childrenVisitor),
          incomingHTMLFileName: './src/test-cases/screens/pm-3010pl-input.html',
          expectedJSONFile: './src/test-cases/screens/pm-3010pl-output.json',
          parent: createRoot(),
      },
      {
          testName: 'screen/sc-000001',
          visitorsFactory: (childrenVisitor) => createAllVisitors(childrenVisitor),
          incomingHTMLFileName: './src/test-cases/screens/sc-000001-input.html',
          expectedJSONFile: './src/test-cases/screens/sc-000001-output.json',
          parent: createRoot(),
      },
      {
          testName: 'screen/sc-000001-disabled',
          visitorsFactory: (childrenVisitor) => createAllVisitors(childrenVisitor),
          incomingHTMLFileName:
        './src/test-cases/screens/sc-000001-disabled-fields-input.html',
          expectedJSONFile:
        './src/test-cases/screens/sc-000001-disabled-fields-output.json',
          parent: createRoot(),
      },
      {
          testName: 'screen/po-301000-po-history',
          visitorsFactory: (childrenVisitor) => createAllVisitors(childrenVisitor),
          incomingHTMLFileName:
        './src/test-cases/screens/po-301000-po-history-input.html',
          expectedJSONFile:
        './src/test-cases/screens/po-301000-po-history-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/tool-bar',
          visitorsFactory: () => [new QPToolBarVisitor()],
          incomingHTMLFileName: './src/test-cases/elements/tool-bar-input.html',
          expectedJSONFile: './src/test-cases/elements/tool-bar-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/grid-tool-bar',
          visitorsFactory: (childrenVisitor) => [
              new QPGridToolBarVisitor(childrenVisitor),
              new QPToolBarVisitor(),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/grid-tool-bar-input.html',
          expectedJSONFile: './src/test-cases/elements/grid-tool-bar-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/filter-bar',
          visitorsFactory: () => [new QPFilterBarVisitor()],
          incomingHTMLFileName: './src/test-cases/elements/filter-bar-input.html',
          expectedJSONFile: './src/test-cases/elements/filter-bar-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/grid',
          visitorsFactory: (childrenVisitor) => [
              new QPGridVisitor(childrenVisitor),
          ],
          incomingHTMLFileName: './src/test-cases/elements/grid-input.html',
          expectedJSONFile: './src/test-cases/elements/grid-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/tab-bar',
          visitorsFactory: (childrenVisitor) => [
              new QPTabBarVisitor(childrenVisitor),
          ],
          incomingHTMLFileName: './src/test-cases/elements/tab-bar-input.html',
          expectedJSONFile: './src/test-cases/elements/tab-bar-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/checkbox-checked',
          visitorsFactory: () => [new QPFieldCheckboxVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/checkbox-checked-input.html',
          expectedJSONFile:
        './src/test-cases/elements/checkbox-checked-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/checkbox-unchecked',
          visitorsFactory: () => [new QPFieldCheckboxVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/checkbox-unchecked-input.html',
          expectedJSONFile:
        './src/test-cases/elements/checkbox-unchecked-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-set-blue',
          visitorsFactory: (childrenVisitor) => [
              new QPFieldsetVisitor(childrenVisitor),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-blue-input.html',
          expectedJSONFile: './src/test-cases/elements/field-set-blue-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-set-default',
          visitorsFactory: (childrenVisitor) => [
              new QPFieldsetVisitor(childrenVisitor),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-default-input.html',
          expectedJSONFile:
        './src/test-cases/elements/field-set-default-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-set-gray',
          visitorsFactory: (childrenVisitor) => [
              new QPFieldsetVisitor(childrenVisitor),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-gray-input.html',
          expectedJSONFile: './src/test-cases/elements/field-set-gray-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-set-button',
          visitorsFactory: () => [new QPFieldButtonVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-button-input.html',
          expectedJSONFile:
        './src/test-cases/elements/field-set-button-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-set-statuses',
          visitorsFactory: (childrenVisitor) => [
              new QPFieldsetVisitor(childrenVisitor),
              new QPFieldStatusVisitor(),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-statuses-input.html',
          expectedJSONFile:
        './src/test-cases/elements/field-set-statuses-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-set-radio',
          visitorsFactory: (childrenVisitor) => [
              new QPFieldsetVisitor(childrenVisitor),
              new QPFieldRadioButtonVisitor(),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-radio-input.html',
          expectedJSONFile: './src/test-cases/elements/field-set-radio-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-set-check-box-container',
          visitorsFactory: (childrenVisitor) => [
              new QPFieldContainerVisitor(childrenVisitor),
              new QPFieldCheckboxVisitor(),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-check-box-container-input.html',
          expectedJSONFile:
        './src/test-cases/elements/field-set-check-box-container-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-mandatory',
          visitorsFactory: () => [new QPFieldSelectorVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/field-mandatory-input.html',
          expectedJSONFile: './src/test-cases/elements/field-mandatory-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-with-selector-and-checkbox',
          visitorsFactory: (childrenVisitor) => [
              new QPFieldContainerVisitor(childrenVisitor),
              new QPNoFieldSelectorVisitor(),
              new QPFieldCheckboxVisitor(),
          ],
          incomingHTMLFileName:
        './src/test-cases/elements/field-with-selector-and-checkbox-input.html',
          expectedJSONFile:
        './src/test-cases/elements/field-with-selector-and-checkbox-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-mask-editor-element',
          visitorsFactory: () => [new QPFieldMaskEditorElementVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-mask-editor-element-input.html',
          expectedJSONFile:
        './src/test-cases/elements/field-set-mask-editor-element-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/field-mask-editor-attribute',
          visitorsFactory: () => [new QPFieldMaskEditorAttributeVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/field-set-mask-editor-attribute-input.html',
          expectedJSONFile:
        './src/test-cases/elements/field-set-mask-editor-attribute-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/grid-footer-gi',
          visitorsFactory: () => [new QPGridFooterGIVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/grid-footer-gi-input.html',
          expectedJSONFile: './src/test-cases/elements/grid-footer-gi-output.json',
          parent: createGrid(),
      },
      {
          testName: 'elements/grid-footer-simple',
          visitorsFactory: () => [new QPGridFooterSimpleVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/grid-footer-simple-input.html',
          expectedJSONFile:
        './src/test-cases/elements/grid-footer-simple-output.json',
          parent: createGrid(),
      },
      {
          testName: 'elements/grid-caption',
          visitorsFactory: (childrenVisitor) => [
              new QPGridVisitor(childrenVisitor),
          ],
          incomingHTMLFileName: './src/test-cases/elements/grid-caption-input.html',
          expectedJSONFile: './src/test-cases/elements/grid-caption-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/rich-text-editor',
          visitorsFactory: () => [new QPRichTextEditorVisitor()],
          incomingHTMLFileName:
        './src/test-cases/elements/rich-text-editor-input.html',
          expectedJSONFile:
        './src/test-cases/elements/rich-text-editor-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/image-view',
          visitorsFactory: () => [new QPImageViewVisitor()],
          incomingHTMLFileName: './src/test-cases/elements/image-view-input.html',
          expectedJSONFile: './src/test-cases/elements/image-view-output.json',
          parent: createRoot(),
      },
      {
          testName: 'elements/tree',
          visitorsFactory: () => [new QPTreeVisitor()],
          incomingHTMLFileName: './src/test-cases/elements/tree-input.html',
          expectedJSONFile: './src/test-cases/elements/tree-output.json',
          parent: createRoot(),
      },
  ];

  it.each(testCases)(
      '$testName',
      ({ incomingHTMLFileName, expectedJSONFile, visitorsFactory, parent }) => {
          const incomingHTML = fs.readFileSync(incomingHTMLFileName, 'utf8');
          const expectedJSON = fs.readFileSync(expectedJSONFile, 'utf8');

          const parser = new DOMParser();
          const doc = parser.parseFromString(incomingHTML, 'text/html');

          const childrenVisitor = new ChildrenVisitor();
          const children = visitorsFactory(childrenVisitor);
          childrenVisitor.populate(children);
          childrenVisitor.visit(doc.body.children[0], parent);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const expected = JSON.parse(expectedJSON);
          expect(parent).toEqual(expected);
      },
  );
});
