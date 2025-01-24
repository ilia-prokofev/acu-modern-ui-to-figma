import {ButtonStyle} from "../elements/button";
import {findElementByClassesDown} from "./html-element-utils";

export function getButtonStyle(element: Element): ButtonStyle {
    return getLiButtonStyle(element) ?? ButtonStyle.Tertiary;
}

function getLiButtonStyle(element: Element): ButtonStyle | null {
    if (findElementByClassesDown(element, "qp-connotation-Success")) {
        return ButtonStyle.Special;
    }

    return null;
}