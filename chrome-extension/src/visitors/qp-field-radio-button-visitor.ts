import ElementVisitor from './qp-element-visitor'
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements'
import { AcuContainer } from '@modern-ui-to-figma/elements'
import {
  concatElementID,
  findElementByClassesDown,
  findElementByNodeNameDown,
  isElementDisabled,
} from './html-element-utils'
import {
  QPFieldElementType,
  QPFieldRadioButton,
} from '@modern-ui-to-figma/elements'
import { getFieldLabel, isFieldMandatory } from './qp-field-utils'

export default class QPFieldRadioButtonVisitor implements ElementVisitor {
  visit(htmlElement: Element, parent: AcuElement): boolean {
    if (!(parent as AcuContainer)?.Children) {
      return false
    }

    if (htmlElement.nodeName.toLowerCase() !== 'qp-field') {
      return false
    }

    if (htmlElement.getAttribute('control-type') !== 'qp-radio') {
      return false
    }

    const radioGroupElement = findElementByClassesDown(
      htmlElement,
      'qp-radio-group',
    )
    if (!radioGroupElement) {
      return true
    }

    for (const radioElement of radioGroupElement.children) {
      const inputElement = findElementByNodeNameDown(radioElement, 'input')
      if (!inputElement) {
        continue
      }

      const field: QPFieldRadioButton = {
        Type: AcuElementType.Field,
        Id: concatElementID(parent.Id, htmlElement),
        ElementType: QPFieldElementType.RadioButton,
        Checked: inputElement?.getAttribute('checked') === 'checked',
        RadioName: getFieldLabel(radioElement),
        ReadOnly: isElementDisabled(htmlElement),
        Mandatory: isFieldMandatory(htmlElement),
      }

      ;(parent as AcuContainer).Children.push(field)
    }

    return true
  }
}
