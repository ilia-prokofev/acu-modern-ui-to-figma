import {FigmaNode} from "./figma-node";
import {QPFieldCheckbox} from "./elements/qp-field";

export class figmaCheckbox extends FigmaNode {
    constructor(checkbox: QPFieldCheckbox, name: string) {
        super(name, 'INSTANCE');
        this.componentProperties['Value ▶#6695:0'] = checkbox.CheckboxName ?? '';
        this.componentProperties['Selected'] = checkbox.Checked ? 'True' : 'False';
    }
}