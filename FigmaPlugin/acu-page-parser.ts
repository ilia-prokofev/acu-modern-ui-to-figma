import AcuElement, {AcuElementType} from "./elements/acu-element";
import {JSDOM} from 'jsdom';
import {Visit} from "./element-visitors/all-visitors";
import {AcuContainer} from "./elements/acu-container";

export default class AcuPageParser {
    async parse(html: string): Promise<AcuElement | null> {
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const root: AcuContainer = {
            Type: AcuElementType.Root,
            Children: [],
        }
        for (const child of document.body.children) {
            Visit(child as HTMLElement, root);
        }
        return root;
    }
}