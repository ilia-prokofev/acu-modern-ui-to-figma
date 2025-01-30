import ElementVisitor from './qp-element-visitor'
import { AcuElement, AcuElementType } from '@modern-ui-to-figma/elements'
import { AcuContainer } from '@modern-ui-to-figma/elements'
import {
  concatElementID,
  findElementByNodeNameDown,
  findFirstLeafTextContent,
  isElementDisabled,
} from './html-element-utils'
import { QPFieldElementType, QPFieldStatus } from '@modern-ui-to-figma/elements'
import { getFieldLabel, isFieldMandatory } from './qp-field-utils'

export default class QPFieldStatusVisitor implements ElementVisitor {
  visit(htmlElement: Element, parent: AcuElement): boolean {
    if (!(parent as AcuContainer)?.Children) {
      return false
    }

    if (htmlElement.nodeName.toLowerCase() !== 'qp-field') {
      return false
    }

    if (htmlElement.getAttribute('name') !== 'Status') {
      return false
    }

    const enhancedComposeElement = findElementByNodeNameDown(
      htmlElement,
      'enhanced-compose',
    )
    if (!enhancedComposeElement) {
      return false
    }

    const field: QPFieldStatus = {
      Type: AcuElementType.Field,
      ReadOnly: isElementDisabled(htmlElement),
      ElementType: QPFieldElementType.Status,
      Id: concatElementID(parent.Id, htmlElement),
      Label: getFieldLabel(htmlElement),
      Value: findFirstLeafTextContent(enhancedComposeElement),
      Mandatory: isFieldMandatory(htmlElement),
    }

    ;(parent as AcuContainer).Children.push(field)
    return true
  }
}
