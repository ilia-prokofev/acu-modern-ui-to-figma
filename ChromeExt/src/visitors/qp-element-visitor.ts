import {AcuElement} from "../elements/acu-element";
import ChildrenVisitor from "./children-visitors";

export default interface ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement, allVisitor: ChildrenVisitor): boolean;
}