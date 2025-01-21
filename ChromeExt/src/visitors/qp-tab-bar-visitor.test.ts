import * as fs from "node:fs";
import {AcuElementType} from "../elements/acu-element";
import {Grid} from "../elements/qp-grid";
import {AcuContainer} from "../elements/acu-container";
import ChildrenVisitor from "./children-visitors";
import QPTabBarVisitor from "./qp-tab-bar-visitor";

describe('qp-tab-bar-visitor', () => {
    test('qp-tab-bar-visitor', () => {
        const sut = new QPTabBarVisitor();

        const inputHtml = fs.readFileSync('./visitors/qp-tab-bar-visitor-input.html', 'utf-8');
        const expectedJson = fs.readFileSync('./visitors/qp-tab-bar-visitor-output.json', 'utf-8');

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
