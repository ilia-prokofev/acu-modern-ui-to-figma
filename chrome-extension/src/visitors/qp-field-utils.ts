import {findElementByClassesDown, findElementByNodeNameDown} from './html-element-utils';

export function getFieldLabel(htmlElement: Element): string | null {
    const labelElement = findElementByNodeNameDown(htmlElement, 'label');
    if (!labelElement) {
        return null;
    }

    return labelElement.textContent?.trim() ?? null;
}

export function getInputValue(element: Element): string | null {
    const input = findElementByNodeNameDown(element, 'input');
    return input?.attributes.getNamedItem('value')?.value ?? null;
}

export function isFieldMandatory(element: Element): boolean {
    return findElementByClassesDown(element, 'req-l') !== null;
}