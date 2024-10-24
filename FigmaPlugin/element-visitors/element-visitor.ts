import AcuElement from "../elements/acu-element";

export default interface ElementVisitor {
    visit(htmlElement: HTMLElement, parent: AcuElement): boolean;
}