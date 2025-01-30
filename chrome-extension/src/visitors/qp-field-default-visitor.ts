import ElementVisitor from './qp-element-visitor'
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements'
import { AcuContainer } from '@modern-ui-to-figma/elements'
import {
  QPFieldElementType,
  QPFieldTextEditor,
} from '@modern-ui-to-figma/elements'
import { concatElementID, isElementDisabled } from './html-element-utils'
import {
  getFieldLabel,
  getInputValue,
  isFieldMandatory,
} from './qp-field-utils'

export default class QPFieldDefaultVisitor implements ElementVisitor {
  visit(htmlElement: Element, parent: AcuElement): boolean {
    if (!(parent as AcuContainer)?.Children) {
      return false
    }

    if (htmlElement.nodeName.toLowerCase() !== 'qp-field') {
      return false
    }

    const field: QPFieldTextEditor = {
      Type: AcuElementType.Field,
      ReadOnly: isElementDisabled(htmlElement),
      ElementType: QPFieldElementType.TextEditor,
      Id: concatElementID(parent.Id, htmlElement),
      Label: getFieldLabel(htmlElement),
      Value: getInputValue(htmlElement),
      Mandatory: isFieldMandatory(htmlElement),
    }
    ;(parent as AcuContainer).Children.push(field)
    return true
  }
}
