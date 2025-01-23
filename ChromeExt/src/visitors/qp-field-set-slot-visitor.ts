import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {FieldsetSlot} from "../elements/qp-fieldset-slot";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {concatElementID} from "./html-element-utils";

export default class QPFieldSetSlotVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "div") {
            return false;
        }

        const slotAttr = htmlElement.attributes.getNamedItem("slot");
        if (!slotAttr) {
            return false;
        }

        const child: FieldsetSlot = {
            Type: AcuElementType.FieldsetSlot,
            Id: concatElementID(parent.Id, htmlElement),
            Children: [],
            ID: slotAttr.value,
        };

        (parent as AcuContainer).Children.push(child);

        allVisitor.visitChildren(htmlElement, child);

        return true;
    }
}