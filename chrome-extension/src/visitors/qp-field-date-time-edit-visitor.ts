import ElementVisitor from './qp-element-visitor'
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements'
import { AcuContainer } from '@modern-ui-to-figma/elements'
import {
  concatElementID,
  findElementByClassesDown,
  isElementDisabled,
} from './html-element-utils'
import {
  QPFieldDateTimeEdit,
  QPFieldElementType,
} from '@modern-ui-to-figma/elements'
import {
  getFieldLabel,
  getInputValue,
  isFieldMandatory,
} from './qp-field-utils'

export default class QPFieldDateTimeEditVisitor implements ElementVisitor {
  visit(htmlElement: Element, parent: AcuElement): boolean {
    if (!(parent as AcuContainer)?.Children) {
      return false
    }

    if (htmlElement.nodeName.toLowerCase() !== 'qp-field') {
      return false
    }

    if (!findElementByClassesDown(htmlElement, 'qp-datetime-edit-control')) {
      return false
    }

    const field: QPFieldDateTimeEdit = {
      Type: AcuElementType.Field,
      ReadOnly: isElementDisabled(htmlElement),
      ElementType: QPFieldElementType.DateTimeEdit,
      Id: concatElementID(parent.Id, htmlElement),
      Label: getFieldLabel(htmlElement),
      Value: getInputValue(htmlElement),
      Mandatory: isFieldMandatory(htmlElement),
    }

    ;(parent as AcuContainer).Children.push(field)
    return true
  }
}
