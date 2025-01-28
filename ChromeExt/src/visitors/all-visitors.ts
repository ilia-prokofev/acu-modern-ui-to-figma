import QPRootVisitor from "./qp-root-visitor";
import QPToolBarVisitor from "./qp-tool-bar-visitor";
import QPFilterBarVisitor from "./qp-filter-bar-visitor";
import QPTemplateVisitor from "./qp-template-visitor";
import QPFieldSetSlotVisitor from "./qp-field-set-slot-visitor";
import QPFieldSetVisitor from "./qp-field-set-visitor";
import QPFieldContainerVisitor from "./qp-field-container-visitor";
import QPTabBarVisitor from "./qp-tab-bar-visitor";
import QPGridVisitor from "./qp-grid-visitor";
import QPGridToolBarVisitor from "./qp-grid-tool-bar-visitor";
import QPGridFooterGIVisitor from "./qp-grid-footer-gi-visitor";
import QPGridFooterSimpleVisitor from "./qp-grid-footer-simple-visitor";
import ElementVisitor from "./qp-element-visitor";
import QPFieldStatusVisitor from "./qp-field-status-visitor";
import QPFieldTextAreaVisitor from "./qp-field-textarea-visitor";
import QPFieldTextEditorVisitor from "./qp-field-text-editor-visitor";
import QPFieldSelectorVisitor from "./qp-field-selector-visitor";
import QPFieldDropDownVisitor from "./qp-field-drop-down-visitor";
import QPFieldCheckboxVisitor from "./qp-field-checkbox-visitor";
import QPFieldDateTimeEditVisitor from "./qp-field-date-time-edit-visitor";
import QPFieldCurrencyVisitor from "./qp-field-currency-visitor";
import QPFieldNumberEditorVisitor from "./qp-field-number-editor-visitor";
import QPFieldButtonVisitor from "./qp-field-button-visitor";
import QpFieldRadioButtonVisitor from "./qp-field-radio-button-visitor";

export const allVisitors: ElementVisitor[] = [
    new QPRootVisitor(),
    new QPToolBarVisitor(),
    new QPFilterBarVisitor(),
    new QPTemplateVisitor(),
    new QPFieldSetSlotVisitor(),
    new QPFieldSetVisitor(),
    new QPFieldCurrencyVisitor(),
    new QPFieldContainerVisitor(),
    new QPFieldStatusVisitor(),
    new QPFieldTextAreaVisitor(),
    new QPFieldTextEditorVisitor(),
    new QPFieldSelectorVisitor(),
    new QPFieldDropDownVisitor(),
    new QPFieldCheckboxVisitor(),
    new QPFieldDateTimeEditVisitor(),
    new QPFieldNumberEditorVisitor(),
    new QPFieldButtonVisitor(),
    new QpFieldRadioButtonVisitor(),
    new QPTabBarVisitor(),
    new QPGridVisitor(),
    new QPGridToolBarVisitor(),
    new QPGridFooterGIVisitor(),
    new QPGridFooterSimpleVisitor(),
];