import {AcuElement} from "@modern-ui-to-figma/elements";
import ChildrenVisitor from "./children-visitors";

export default interface ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean;
}