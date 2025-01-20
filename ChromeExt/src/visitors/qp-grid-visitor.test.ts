import * as fs from "node:fs";
import QPGridVisitor from "./qp-grid-visitor";
import {AcuElementType} from "../elements/acu-element";
import {Grid} from "../elements/qp-grid";
import {AcuContainer} from "../elements/acu-container";
import ChildrenVisitor from "./children-visitors";

describe('qp-grid-visitor', () => {
    test('qp-grid-visitor', () => {
        const sut = new QPGridVisitor();

        const inputHtml = fs.readFileSync('./visitors/qp-grid-visitor-input.html', 'utf-8');
        const expectedJson = fs.readFileSync('./visitors/qp-grid-visitor-output.json', 'utf-8');

        const parser = new DOMParser();
        const doc = parser.parseFromString(inputHtml, 'text/html');

        const parent: AcuContainer = {
            Type: AcuElementType.Root,
            Children: [],
        }

        sut.visit(doc.body.children[0], parent, new ChildrenVisitor([]));

        const expected = JSON.parse(expectedJson) as Grid;
        expect(parent.Children[0]).toEqual(expected);
    });
});
