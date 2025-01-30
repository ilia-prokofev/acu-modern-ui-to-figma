import QPRootVisitor from './qp-root-visitor'
import QPToolBarVisitor from './qp-tool-bar-visitor'
import QPFilterBarVisitor from './qp-filter-bar-visitor'
import QPTemplateVisitor from './qp-template-visitor'
import QPFieldSetSlotVisitor from './qp-field-set-slot-visitor'
import QPFieldSetVisitor from './qp-field-set-visitor'
import QPFieldContainerVisitor from './qp-field-container-visitor'
import QPTabBarVisitor from './qp-tab-bar-visitor'
import QPGridVisitor from './qp-grid-visitor'
import QPGridToolBarVisitor from './qp-grid-tool-bar-visitor'
import QPGridFooterGIVisitor from './qp-grid-footer-gi-visitor'
import QPGridFooterSimpleVisitor from './qp-grid-footer-simple-visitor'
import ElementVisitor from './qp-element-visitor'
import QPFieldStatusVisitor from './qp-field-status-visitor'
import QPFieldTextAreaVisitor from './qp-field-textarea-visitor'
import QPFieldTextEditorVisitor from './qp-field-text-editor-visitor'
import QPFieldSelectorVisitor from './qp-field-selector-visitor'
import QPFieldDropDownVisitor from './qp-field-drop-down-visitor'
import QPFieldCheckboxVisitor from './qp-field-checkbox-visitor'
import QPFieldDateTimeEditVisitor from './qp-field-date-time-edit-visitor'
import QPFieldCurrencyVisitor from './qp-field-currency-visitor'
import QPFieldNumberEditorVisitor from './qp-field-number-editor-visitor'
import QPFieldButtonVisitor from './qp-field-button-visitor'
import QPFieldRadioButtonVisitor from './qp-field-radio-button-visitor'
import QPNoFieldSelectorVisitor from './qp-field-no-label-selector-visitor'
import QPFieldMaskEditorElementVisitor from './qp-field-mask-editor-element-visitor'
import QPFieldMaskEditorAttributeVisitor from './qp-field-mask-editor-attribute-visitor'
import QPSplitterVisitor from './qp-splitter-visitor'
import QPRichTextEditorVisitor from './qp-rich-text-editor-visitor'
import QPImageViewVisitor from './qp-image-view-visitor'
import QPTreeVisitor from './qp-tree-visitor'
import QPFieldDefaultVisitor from './qp-field-default-visitor'
import ChildrenVisitor from './children-visitors'

export function createAllVisitors(
  childrenVisitor: ChildrenVisitor,
): ElementVisitor[] {
  return [
    new QPRootVisitor(childrenVisitor),
    new QPToolBarVisitor(),
    new QPFilterBarVisitor(),
    new QPTemplateVisitor(childrenVisitor),
    new QPFieldSetSlotVisitor(childrenVisitor),
    new QPFieldSetVisitor(childrenVisitor),
    new QPFieldCurrencyVisitor(),
    new QPFieldContainerVisitor(childrenVisitor),
    new QPFieldStatusVisitor(),
    new QPFieldTextAreaVisitor(),
    new QPFieldTextEditorVisitor(),
    new QPNoFieldSelectorVisitor(),
    new QPFieldSelectorVisitor(),
    new QPFieldMaskEditorElementVisitor(),
    new QPFieldMaskEditorAttributeVisitor(),
    new QPFieldDropDownVisitor(),
    new QPFieldCheckboxVisitor(),
    new QPFieldDateTimeEditVisitor(),
    new QPFieldNumberEditorVisitor(),
    new QPFieldButtonVisitor(),
    new QPFieldRadioButtonVisitor(),
    new QPTabBarVisitor(childrenVisitor),
    new QPGridVisitor(childrenVisitor),
    new QPGridToolBarVisitor(childrenVisitor),
    new QPGridFooterGIVisitor(),
    new QPGridFooterSimpleVisitor(),
    new QPSplitterVisitor(childrenVisitor),
    new QPRichTextEditorVisitor(),
    new QPImageViewVisitor(),
    new QPTreeVisitor(),
    new QPFieldDefaultVisitor(), // this field visitor should be the latest one, because it returns default QPField when others were not visited
  ]
}
