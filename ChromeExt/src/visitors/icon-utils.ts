import {IconType} from "../elements/icon";
import {findAttributeValueDown} from "./html-element-utils";

export function getIconType(element: Element): IconType | null {
    return getIconByIconAttribute(element)
        || getIconByHrefAttribute(element);
}

function getIconByIconAttribute(element: Element): IconType | null {
    const icon = findAttributeValueDown(element, "icon")?.toLowerCase();
    if (!icon) {
        return null;
    }

    if( icon.includes("recordadd")){
        return IconType.AddRow;
    }

    if (icon.includes("adjust")) {
        return IconType.AdjustColumns;
    }

    if (icon.includes("arrow_down")) {
        return IconType.ArrowDown;
    }

    if (icon.includes("cancelclose")) {
        return IconType.Back;
    }

    if (icon.includes("copy")) {
        return IconType.Copy;
    }

    if (icon.includes("remove")) {
        return IconType.Delete;
    }

    if (icon.includes("recorddel")) {
        return IconType.DeleteRow;
    }

    if (icon.includes("recordedit")) {
        return IconType.Edit;
    }

    if (icon.includes("excel")) {
        return IconType.ExportToExcel;
    }

    if (icon.includes("pagefirst")) {
        return IconType.First;
    }

    if (icon.includes("upload")) {
        return IconType.Import;
    }

    if (icon.includes("addnew")) {
        return IconType.Insert;
    }

    if (icon.includes("pagelast")) {
        return IconType.Last;
    }

    if (icon.includes("pagenext")) {
        return IconType.Next;
    }

    if (icon.includes("pageprev")) {
        return IconType.Previous;
    }

    if (icon.includes("refresh")) {
        return IconType.Refresh;
    }

    if (icon.includes("saveclose")) {
        return IconType.SaveAndBack;
    }

    if (icon.includes("save")) {
        return IconType.Save;
    }

    if (icon.includes("cancel")) {
        return IconType.Undo;
    }

    return null;
}

function getIconByHrefAttribute(element: Element): IconType | null {
    const href = findAttributeValueDown(element, "href")?.toLowerCase();
    if (!href) {
        return null;
    }

    if (href.includes("ellipsis") ||
        href.includes("dots")) {
        return IconType.Ellipsis;
    }

    return null;
}