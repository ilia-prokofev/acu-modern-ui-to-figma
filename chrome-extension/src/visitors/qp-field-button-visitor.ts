import ElementVisitor from './qp-element-visitor'
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements'
import { AcuContainer } from '@modern-ui-to-figma/elements'
import {
  concatElementID,
  findElementByNodeNameDown,
} from './html-element-utils'
import { QPFieldButton, QPFieldElementType } from '@modern-ui-to-figma/elements'
import { getFieldLabel, isFieldMandatory } from './qp-field-utils'
import { parseButton } from './button-utils'

export default class QPFieldButtonVisitor implements ElementVisitor {
  visit(htmlElement: Element, parent: AcuElement): boolean {
    if (!(parent as AcuContainer)?.Children) {
      return false
    }

    if (htmlElement.nodeName.toLowerCase() !== 'qp-field') {
      return false
    }

    if (!findElementByNodeNameDown(htmlElement, 'qp-button')) {
      return false
    }

    const button = parseButton(htmlElement)
    const field: QPFieldButton = {
      Type: AcuElementType.Field,
      ReadOnly: !button.Enabled,
      ElementType: QPFieldElementType.Button,
      Id: concatElementID(parent.Id, htmlElement),
      Label: getFieldLabel(htmlElement),
      Value: button.Text,
      Mandatory: isFieldMandatory(htmlElement),
    }

    ;(parent as AcuContainer).Children.push(field)
    return true
  }
}
