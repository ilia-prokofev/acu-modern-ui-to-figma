import {findElementByClassesDown, findFirstLeafTextContent} from "./html-element-utils";

export function getSelectorLink(element: Element): string | null {
    const selectorLinkElement = findElementByClassesDown(element, 'qp-selector-link');
    if (!selectorLinkElement) {
        return null;
    }

    let text: string | null = null;
    for (const child of selectorLinkElement.children) {
        const textContent = findFirstLeafTextContent(child)
        if (!textContent || textContent.length === 0) {
            continue;
        }

        if (!text) {
            text = '';
        }

        text += textContent;
    }

    return text;
}