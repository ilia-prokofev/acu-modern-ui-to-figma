import {AcuPageParser} from "./acu-page-parser";
import {AcuElement} from "./elements";
import * as fs from "node:fs";

describe('AcuPageParser', () => {
    let sut: AcuPageParser;

    beforeEach(() => {
        sut = new AcuPageParser();
    });

    test('exmaple', () => {
        const inputHtml = fs.readFileSync('example.html', 'utf-8');
        const expectedJson = fs.readFileSync('example.json', 'utf-8');

        const actual = sut.parse(inputHtml);

        const expected = JSON.parse(expectedJson) as AcuElement;
        expect(actual).toEqual(expected);
    });
});