import {FigmaNode} from './figma-node';
import {
    QPField,
    QPFieldButton,
    QPFieldCheckbox,
    QPFieldElementType,
    QPFieldHorizontalContainer,
    QPFieldLabelValue,
    QPFieldMultilineTextEditor,
    QPFieldRadioButton,
    QPFieldSelector,
    QPFieldStatus
} from '@modern-ui-to-figma/elements';
import {IconType} from '@modern-ui-to-figma/elements';
import {compCheckbox, logger} from './figma-main';
import {FigmaCheckbox} from './figma-checkbox';
import {FigmaValue} from './figma-value';

const supportedStatuses = ['Open', 'Unpaid', 'Paid', 'New', 'In Process', 'Info Requested', 'On Hold'] as const;

export class FigmaRow extends FigmaNode {

    static rowTypes = new Map<QPFieldElementType, string>([
        [QPFieldElementType.Currency, 'Currency'],
        [QPFieldElementType.CheckBox, 'Checkbox'],
        [QPFieldElementType.DateTimeEdit, 'Date'],
        [QPFieldElementType.DropDown, 'Field'],
        [QPFieldElementType.TextEditor, 'Field'],
        [QPFieldElementType.Selector, 'Field'],
        [QPFieldElementType.NumberEditor, 'Number Field'],
        [QPFieldElementType.Status, 'Field'],
        [QPFieldElementType.Button, 'Button Left'],
        [QPFieldElementType.RadioButton, 'Radiobutton'],
        [QPFieldElementType.MultilineTextEditor, 'Text Area'],
        [QPFieldElementType.HorizontalContainer, 'Field'],
        [QPFieldElementType.LabelFieldCheckbox, 'Field + Checkbox'],
        [QPFieldElementType.LabelFieldButton, 'Field + Button']
    ]);

    constructor(field: QPField, name: string, parent: FigmaNode | null = null) {
        super(name, 'INSTANCE');
        this.acuElement = field;

        if (!field.ElementType) {
            logger.Warn(`Row type can not be null (${JSON.stringify(field)})`, this.acuElement.Id, field);
            return;
        }

        let elementType = field.ElementType;

        if (elementType == QPFieldElementType.HorizontalContainer) {
            const typedField = field as QPFieldHorizontalContainer;
            if (typedField.Children.length == 2) {
                const child1 = typedField.Children[0] as QPField;
                const child2 = typedField.Children[1] as QPField;

                if (child1.ElementType == QPFieldElementType.Selector && child2.ElementType == QPFieldElementType.CheckBox)
                    elementType = QPFieldElementType.LabelFieldCheckbox;
            }
        }

        if (!FigmaRow.rowTypes.has(field.ElementType)) {
            logger.Warn(`${field.ElementType} row type is not supported`, this.acuElement.Id, field);
            elementType = QPFieldElementType.TextEditor;
        }

        if (elementType != QPFieldElementType.HorizontalContainer) {
            //this.componentProperties['Type'] = FigmaRow.rowTypes.get(elementType)!;
            const rightContentField = new FigmaNode('👉 RIGHT_CONTENT');
            rightContentField.componentProperties['Property'] = FigmaRow.rowTypes.get(elementType)!;
            this.children.push(rightContentField);
        }

        let labelField;
        let valueField;
        let typedField;
        let defaultState = 'Default';

        switch (elementType) {
        case QPFieldElementType.CheckBox:
            typedField = field as QPFieldCheckbox;
            valueField = new FigmaCheckbox(typedField, 'Checkbox');
            this.children.push(valueField);
            labelField = new FigmaNode('👉 LEFT_CONTENT');
            labelField.componentProperties['Show Value#9992:0'] = false;
            this.children.push(labelField);
            break;
        case QPFieldElementType.RadioButton:
            this.componentProperties['Show LeftContent#9784:31'] = false;
            typedField = field as QPFieldRadioButton;
            valueField = new FigmaNode('Radio Button');
            valueField.componentProperties['Name#8227:0'] = typedField.RadioName ?? '';
            valueField.componentProperties['Checked'] = typedField.Checked ? 'True' : 'False';
            this.children.push(valueField);
            break;
        case QPFieldElementType.Button:
            typedField = field as QPFieldButton;
            valueField = new FigmaNode('Button');
            valueField.componentProperties['Type'] = 'Secondary';
            valueField.componentProperties['Value ▶#3133:332'] = typedField.Value ?? '';
            this.children.push(valueField);
            labelField = new FigmaNode('👉 LEFT_CONTENT');
            labelField.componentProperties['Show Value#9992:0'] = false;
            this.children.push(labelField);
            break;
        case QPFieldElementType.MultilineTextEditor:
            typedField = field as QPFieldMultilineTextEditor;
            labelField = new FigmaNode('Label');
            labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label ?? '';
            this.children.push(labelField);

            valueField = new FigmaNode('Text Area');
            valueField.componentProperties['Text Value ▶#4221:3'] = typedField.Value ?? '';
            defaultState = 'Normal';
            this.children.push(valueField);
            break;
        case QPFieldElementType.Status:{
            typedField = field as QPFieldStatus;
            labelField = new FigmaNode('Label');
            labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label ?? '';
            this.children.push(labelField);

            valueField = new FigmaNode('Field');
            valueField.componentProperties['Type'] = 'Status';
            this.children.push(valueField);

            const status = new FigmaNode('Status');
            const value = typedField.Value ?? supportedStatuses[0];
            status.componentProperties['Status'] =  supportedStatuses.includes(value as typeof supportedStatuses[number])
                ? value
                : supportedStatuses[0];
            this.children.push(status);
        }
            break;
        case QPFieldElementType.HorizontalContainer: {
            let width = 0;
            const itemSpacing = 8;
            const labelWidth = 200;
            if (parent) {
                parent.detach = true;
                width = parent.width;
            }
            this.detach = true;
            typedField = field as QPFieldHorizontalContainer;
            const container = new FigmaNode('Container', 'FRAME');
            container.tryToFind = false;
            container.layoutMode = 'HORIZONTAL';
            container.properties['primaryAxisSizingMode'] = 'AUTO';
            container.properties['counterAxisSizingMode'] = 'AUTO';
            container.properties['itemSpacing'] = 0;
            container.properties['layoutGrow'] = 1;
            container.properties['fills'] = [];

            labelField = new FigmaNode('Label');
            labelField.componentProperties['Label Value ▶#3141:62'] = '';
            this.children.push(labelField);
            if (width > 0)
                width = (width - labelWidth) / typedField.Children.length - itemSpacing;

            this.children.push(container);
            let childNumber = 1;
            for (const childField of typedField.Children) {
                let newChild;
                switch ((childField as QPField).ElementType) {
                case QPFieldElementType.CheckBox:
                    newChild = new FigmaCheckbox(childField as QPFieldCheckbox, `Checkbox ${childNumber++}`);
                    break;
                    // case QPFieldElementType.Selector:
                    //     newChild = new figmaCheckbox(childField as QPFieldCheckbox, `Checkbox ${childNumber++}`);
                    //     break;
                default:
                    continue;
                }

                newChild.tryToFind = false;
                newChild.componentNode = compCheckbox;
                newChild.width = width;
                container.children.push(newChild);
            }
            return;
        }
        case QPFieldElementType.LabelFieldCheckbox:
            typedField = field as QPFieldHorizontalContainer;
            labelField = new FigmaNode('Label');
            labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label ?? '';
            this.children.push(labelField);
            this.children.push(new FigmaValue(typedField.Children[0] as QPFieldSelector));
            this.children.push(new FigmaCheckbox(typedField.Children[1] as QPFieldCheckbox, 'Checkbox'));
            break;
        case QPFieldElementType.TextEditor:
        case QPFieldElementType.Selector:
        case QPFieldElementType.DropDown:
        case QPFieldElementType.NumberEditor:
        case QPFieldElementType.DateTimeEdit:
        case QPFieldElementType.Currency:
            typedField = field as QPFieldLabelValue;
            labelField = new FigmaNode('Label');
            labelField.componentProperties['Label Value ▶#3141:62'] = typedField.Label ?? '';
            this.children.push(labelField);

            valueField = new FigmaNode('Field');
            valueField.componentProperties['Text Value ▶#3161:0'] = typedField.Value ?? '';
            if (elementType == QPFieldElementType.DropDown)
                valueField.iconProperties['Icon#3160:22'] = IconType.ArrowDown;
            if (elementType == QPFieldElementType.TextEditor)
                valueField.componentProperties['Show Icon#3160:30'] = false;

            this.children.push(valueField);
            break;
        default:
            logger.Warn(`${elementType} row element type not supported`, this.acuElement.Id, field);
            break;
        }
        if (labelField && !field.ReadOnly && field.Mandatory)
            labelField.componentProperties['Mandatory#3141:16'] = field.Mandatory;
        if (valueField)
            valueField.componentProperties['State'] = field.ReadOnly == false ? defaultState : 'Disabled';

    }
}