import * as fs from "node:fs";
import {preprocessHtml} from "./html-preprocessor";

test("preprocess", () => {
    const parser = new DOMParser();
    const incomingHTML = fs.readFileSync('./test-cases/preprocess-input.html', 'utf8');
    const doc = parser.parseFromString(incomingHTML, 'text/html');

    const processedHTML = preprocessHtml(doc);
    if (!processedHTML) {
        fail('Unable to preprocess html.');
    }

    fs.writeFileSync('./test-cases/preprocess-output.html', processedHTML, 'utf8');
})
