import {FigmaNode} from "./figma-node";
import {QPFieldLabelValue, QPFieldSelector} from "./elements/qp-field";

export class figmaValue extends FigmaNode {
    constructor(field: QPFieldSelector) {
        super('Field', 'INSTANCE');
        const typedField = field as QPFieldLabelValue;
        this.componentProperties['Text Value ▶#3161:0'] = typedField.Value ?? '';
        this.componentProperties['State'] = field.ReadOnly == false ? 'Default' : 'Disabled';
    }
}