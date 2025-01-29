import {FigmaNode} from "./figma-node";
import {QPFieldCheckbox} from "@modern-ui-to-figma/elements";

export class figmaCheckbox extends FigmaNode {
    constructor(checkbox: QPFieldCheckbox, name: string) {
        super(name, 'INSTANCE');
        this.componentProperties['Value ▶#6695:0'] = checkbox.CheckboxName ?? '';
        this.componentProperties['Selected'] = checkbox.Checked ? 'True' : 'False';
    }
}