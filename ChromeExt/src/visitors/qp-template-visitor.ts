import {AcuElement, AcuElementType} from "../elements/acu-element";
import {AcuContainer} from "../elements/acu-container";
import {Template} from "../elements/qp-template";
import ElementVisitor from "./qp-element-visitor";
import ChildrenVisitor from "./children-visitors";
import {concatElementID} from "./html-element-utils";

export default class QPTemplateVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean {
        if (!(parent as AcuContainer)?.Children) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== "qp-template") {
            return false;
        }

        const child: Template = {
            Type: AcuElementType.Template,
            Id: concatElementID(parent.Id, htmlElement),
            Name: htmlElement.attributes.getNamedItem("name")?.value ?? null,
            Children: [],
        };

        (parent as AcuContainer).Children.push(child);

        allVisitor.visitChildren(htmlElement, child);

        return true;
    }
}