import {AcuAlignment} from '@modern-ui-to-figma/elements';

export function findClasses(htmlElement: Element, ...classNames: string[]): boolean {
    const classAttr = htmlElement.attributes.getNamedItem('class')?.value;
    if (!classAttr) {
        return false;
    }

    const classes = classAttr.split(' ');
    for (let className of classNames) {
        className = className.toLowerCase();
        if (classes.find(c => c.toLowerCase() === className) === undefined) {
            return false;
        }
    }

    return true;
}

export function findElementByClassesDown(htmlElement: Element, ...classNames: string[]): Element | null {
    if (findClasses(htmlElement, ...classNames)) {
        return htmlElement;
    }

    for (let i = 0; i < htmlElement.children.length; i++) {
        const child = findElementByClassesDown(htmlElement.children[i], ...classNames);
        if (child) {
            return child;
        }
    }

    return null;
}

export function findElementByNodeNameDown(htmlElement: Element, nodeName: string,): Element | null {
    if (htmlElement.nodeName.toLowerCase() === nodeName.toLowerCase()) {
        return htmlElement;
    }

    for (let i = 0; i < htmlElement.children.length; i++) {
        const child = findElementByNodeNameDown(htmlElement.children[i], nodeName);
        if (child) {
            return child;
        }
    }

    return null;
}

export function findElementByNodeNameAndClassesDown(
    htmlElement: Element,
    nodeName: string,
    ...classNames: string[]
): Element | null {
    if (htmlElement.nodeName.toLowerCase() === nodeName.toLowerCase() &&
        findClasses(htmlElement, ...classNames)) {
        return htmlElement;
    }

    for (const element of htmlElement.children) {
        const foundElement = findElementByNodeNameAndClassesDown(element, nodeName, ...classNames);
        if (foundElement) {
            return foundElement;
        }
    }

    return null;
}

export function findAllElementsByNodeNameDown(htmlElement: Element, nodeName: string, target: Element[]): void {
    if (htmlElement.nodeName.toLowerCase() === nodeName.toLowerCase()) {
        target.push(htmlElement);
    }

    for (const child of htmlElement.children) {
        findAllElementsByNodeNameDown(child, nodeName, target);
    }
}

export function innerTextContent(htmlElement: Element): string | null {
    if (htmlElement.children.length === 0) {
        return htmlElement.textContent;
    }

    return innerTextContent(htmlElement.children[0]);
}

export function getElementAlignment(htmlElement: Element): AcuAlignment | null {
    const style = htmlElement.getAttribute('style')?.toLowerCase();
    if (!style) {
        return null;
    }

    if (style.includes('left')) {
        return AcuAlignment.Left;
    }

    if (style.includes('right')) {
        return AcuAlignment.Right;
    }

    if (style.includes('center')) {
        return AcuAlignment.Center;
    }

    return null;
}

export function findFirstLeafTextContent(htmlElement: Element): string | null {
    if (htmlElement.children.length === 0) {
        return htmlElement.textContent?.trim() ?? null;
    }

    for (const child of htmlElement.children) {
        const textContent = findFirstLeafTextContent(child);
        if (textContent && textContent.length > 0) {
            return textContent;
        }
    }

    return null;
}

export function findAttributeValueDown(htmlElement: Element, attributeName: string): string | null {
    const value = htmlElement.getAttribute(attributeName);
    if (value) {
        return value;
    }

    for (const child of htmlElement.children) {
        const childValue = findAttributeValueDown(child, attributeName);
        if (childValue) {
            return childValue;
        }
    }

    return null;
}

export function concatElementID(otherId: string, htmlElement: Element): string {
    const id = htmlElement.getAttribute('au-target-id') ??
        htmlElement.getAttribute('id') ??
        htmlElement.nodeName.toLowerCase();
    return `${otherId}-${id}`;
}

export function isElementDisabled(element: Element): boolean {
    const attr = element.getAttribute('enabled')?.toLowerCase();
    if (attr === 'false') {
        return false;
    }

    return findElementByClassesDown(element, 'disabled') !== null
        || findElementByClassesDown(element, 'qp-field-disabled') !== null;
}

export function isHiddenElement(element: Element): boolean {
    if (findClasses(element, 'aurelia-hide')) {
        return true;
    }

    const style = element.getAttribute('style');
    if (!style) {
        return false;
    }

    const negativePositionRegex = /top:\s*-\d+px/;
    return negativePositionRegex.test(style);
}