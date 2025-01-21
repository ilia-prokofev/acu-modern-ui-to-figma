import {AcuPageParser} from "./acu-page-parser";
import * as fs from "node:fs";
import {AcuElement} from "./elements/acu-element";

describe('acu-page-parser', () => {
    let sut: AcuPageParser;

    beforeEach(() => {
        sut = new AcuPageParser();
    });

    test('acu-page-parser', () => {
        const inputHtml = fs.readFileSync('./test-cases/sc-000001-input.html', 'utf-8');
        const expectedJson = fs.readFileSync('./test-cases/sc-000001-output.json', 'utf-8');

        const actual = sut.parse(inputHtml);

        const expected = JSON.parse(expectedJson) as AcuElement;
        expect(actual).toEqual(expected);
    });
});