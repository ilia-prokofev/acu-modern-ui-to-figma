import {ButtonStyle, QPButton} from "../elements/qp-button";
import {
    findClasses,
    findElementByNodeNameDown,
    findFirstLeafTextContent,
    isElementDisabled
} from "./html-element-utils";
import {getIconType} from "./icon-utils";

export function getButtonStyle(element: Element): ButtonStyle {
    let buttonStyle: ButtonStyle | null = null;

    const liElement = findElementByNodeNameDown(element, "li");
    if (liElement) {
        buttonStyle = getLiButtonStyle(liElement);
    }

    return buttonStyle ?? ButtonStyle.Secondary;
}

function getLiButtonStyle(element: Element): ButtonStyle | null {
    if (findClasses(element, "qp-connotation-Success")) {
        return ButtonStyle.Special;
    }

    if (findClasses(element, "minor-button")) {
        return ButtonStyle.Tertiary;
    }

    return null;
}

export function parseButton(element: Element): QPButton {
    const iconType = getIconType(element);
    const enabled = !isElementDisabled(element);
    const text = findFirstLeafTextContent(element);

    return {
        Icon: iconType,
        Enabled: enabled,
        Text: text,
    } as QPButton;
}