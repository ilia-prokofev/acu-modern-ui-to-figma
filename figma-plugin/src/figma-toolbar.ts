import {FigmaNode} from './figma-node';
import {QPToolBar, QPToolBarItemButton, QPToolBarItemType, QPToolBarType} from '@modern-ui-to-figma/elements';
import {buttonIcons, logger} from './figma-main';

export class figmaToolbar extends FigmaNode {

    toolBarTypes = new Map<QPToolBarType, string>([
        [QPToolBarType.List, 'List'],
        [QPToolBarType.Record, 'Record'],
        [QPToolBarType.FilterBar, 'Filter bar']
    ]);

    filterBarMapping = new Map<string, number>([
        ['FilterCombo1', 0],
        ['Separator1', 1],
        ['FilterButton1', 2],
        ['FilterButton2', 3],
        ['FilterButton3', 4],
        ['Button1', 5],
        ['Button2', 6],
        ['Button3', 7]
    ])

    constructor(toolbar: QPToolBar) {
        super('Toolbar');
        this.acuElement = toolbar;

        const displayedButtonsMax = toolbar.ToolBarType == QPToolBarType.Record ? 15 : 11;
        if (this.toolBarTypes.has(toolbar.ToolBarType))
            this.componentProperties['Type'] = this.toolBarTypes.get(toolbar.ToolBarType)!;
        this.componentProperties['Show Right Actions#6826:45'] = toolbar.ShowRightAction;

        if (toolbar.ToolBarType == QPToolBarType.FilterBar) {
            // console.log(111);
            // for (const toolbarItem of toolbar.Items) {
            //     console.log(toolbarItem.ItemType, this.filterBarMapping.get(toolbarItem.ItemType + 1));
            // }
            // console.log(222);
            return;
        }

        const buttons = new FigmaNode('Buttons');
        buttons.childIndex = 0;
        this.children.push(buttons);

        for (let i = 0; i < displayedButtonsMax; i++) {
            const button = new FigmaNode('Button');
            button.childIndex = i;
            buttons.children.push(button);

            if (i >= toolbar.Items.length) {
                button.properties['visible'] = false;
            } else {
                const item = toolbar.Items[i];
                button.properties['visible'] = true;
                if (item.ItemType != QPToolBarItemType.Button) continue;
                const buttonItem = item as QPToolBarItemButton;

                button.componentProperties['Type'] = buttonItem.Style;
                button.componentProperties['State'] = buttonItem.Enabled ? 'Default' : 'Disabled';

                const icon = buttonItem.Icon;
                button.componentProperties['Show Icon Left#3133:110'] = icon != null;
                if (icon)
                    button.iconProperties['Icon Left#3131:0'] = icon;
                const text = buttonItem.Text;
                button.componentProperties['Show Label#3133:443'] = text != null;
                if (text)
                    button.componentProperties['Value ▶#3133:332'] = text;
                //button.componentProperties['Show Icon Right#3133:221'] = false;
            }

        }
    }
}