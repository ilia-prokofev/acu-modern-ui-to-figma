import { AcuElement } from '@modern-ui-to-figma/elements'

export default interface ElementVisitor {
  visit(htmlElement: Element, parent: AcuElement): boolean
}
