import ElementVisitor from './qp-element-visitor'
import { AcuElement } from '@modern-ui-to-figma/elements'
import { findClasses } from './html-element-utils'

export default class ChildrenVisitor {
  private readonly visitors: ElementVisitor[] = []

  public populate(visitors: ElementVisitor[]) {
    for (const visitor of visitors) {
      this.visitors.push(visitor)
    }
  }

  public visitChildren(htmlElement: Element, parent: AcuElement) {
    if (findClasses(htmlElement, 'aurelia-hide')) {
      return
    }

    for (const child of htmlElement.children) {
      this.visit(child, parent)
    }
  }

  public visit(htmlElement: Element, parent: AcuElement) {
    if (findClasses(htmlElement, 'aurelia-hide')) {
      return
    }

    for (const visitor of this.visitors) {
      if (visitor.visit(htmlElement, parent)) {
        return
      }
    }
    this.visitChildren(htmlElement, parent)
  }
}
