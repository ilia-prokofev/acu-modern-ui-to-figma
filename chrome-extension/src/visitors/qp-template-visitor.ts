import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements'
import { AcuContainer } from '@modern-ui-to-figma/elements'
import { Template } from '@modern-ui-to-figma/elements'
import ElementVisitor from './qp-element-visitor'
import ChildrenVisitor from './children-visitors'
import { concatElementID } from './html-element-utils'

export default class QPTemplateVisitor implements ElementVisitor {
  constructor(private readonly childrenVisitor: ChildrenVisitor) {}

  visit(htmlElement: Element, parent: AcuElement): boolean {
    if (!(parent as AcuContainer)?.Children) {
      return false
    }

    if (htmlElement.nodeName.toLowerCase() !== 'qp-template') {
      return false
    }

    const child: Template = {
      Type: AcuElementType.Template,
      Id: concatElementID(parent.Id, htmlElement),
      Name: htmlElement.attributes.getNamedItem('name')?.value ?? null,
      Children: [],
    };

    (parent as AcuContainer).Children.push(child)
    this.childrenVisitor.visitChildren(htmlElement, child)
    return true
  }
}
