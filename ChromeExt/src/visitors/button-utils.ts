import {ButtonStyle, QPButton} from "../elements/qp-button";
import {findElementByClassesDown, findFirstLeafTextContent, isElementDisabled} from "./html-element-utils";
import {getIconType} from "./icon-utils";

export function getButtonStyle(element: Element): ButtonStyle {
    return getLiButtonStyle(element) ?? ButtonStyle.Tertiary;
}

function getLiButtonStyle(element: Element): ButtonStyle | null {
    if (findElementByClassesDown(element, "qp-connotation-Success")) {
        return ButtonStyle.Special;
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