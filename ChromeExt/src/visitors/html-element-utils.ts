import {AcuAlignment} from "../elements/acu-alignment";

export function findClasses(htmlElement: Element, ...classNames: string[]): boolean {
    const classAttr = htmlElement.attributes.getNamedItem("class")?.value;
    if (!classAttr) {
        return false;
    }

    const classes = classAttr.split(" ");
    for (const className of classNames) {
        if (classes.find(c => c === className) === undefined) {
            return false;
        }
    }

    return true;
}

export function findElementByClassesUp(htmlElement: Element, ...classNames: string[]): Element | null {
    if (findClasses(htmlElement, ...classNames)) {
        return htmlElement;
    }

    if (!htmlElement.parentElement) {
        return null;
    }

    return findElementByClassesUp(htmlElement.parentElement, ...classNames);
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

export function findElementByNodeNameDown(htmlElement: Element, nodeName: string): Element | null {
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

export function innerTextContent(htmlElement: Element): string | null {
    if (htmlElement.children.length === 0) {
        return htmlElement.textContent;
    }

    return innerTextContent(htmlElement.children[0]);
}

export function getElementAlignment(htmlElement: Element): AcuAlignment | null {
    const style = htmlElement.getAttribute("style")?.toLowerCase();
    if (!style) {
        return null;
    }

    if (style.includes("left")) {
        return AcuAlignment.Left;
    }

    if (style.includes("right")) {
        return AcuAlignment.Right;
    }

    if (style.includes("center")) {
        return AcuAlignment.Center;
    }

    return null;
}

export function findLeafTextContent(htmlElement: Element): string | null {
    if (htmlElement.children.length === 0) {
        return htmlElement.textContent;
    }

    return findLeafTextContent(htmlElement.children[0]);
}

export function concatElementID(otherId: string, htmlElement: Element): string {
    let id = htmlElement.getAttribute("au-target-id") ??
        htmlElement.getAttribute("id") ??
        htmlElement.nodeName.toLowerCase();
    return `${otherId}-${id}`
}