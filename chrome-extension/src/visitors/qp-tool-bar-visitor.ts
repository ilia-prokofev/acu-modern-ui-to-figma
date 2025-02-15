import ElementVisitor from './qp-element-visitor';
import {AcuElement, AcuElementType} from '@modern-ui-to-figma/elements';
import {
    isQPToolbarContainer,
    QPToolBar,
    QPToolBarItem,
    QPToolBarItemButton,
    QPToolBarItemType,
    QPToolBarType
} from '@modern-ui-to-figma/elements';
import {
    concatElementID,
    findClasses,
    findElementByClassesDown,
    findElementByNodeNameDown,
    isElementDisabled,
    isHiddenElement
} from './html-element-utils';
import {getIconType} from './icon-utils';
import {getButtonStyle} from './button-utils';
import {IconType} from '@modern-ui-to-figma/elements';

export default class QPToolBarVisitor implements ElementVisitor {
    visit(htmlElement: Element, parent: AcuElement): boolean {
        if (!isQPToolbarContainer(parent)) {
            return false;
        }

        if (htmlElement.nodeName.toLowerCase() !== 'qp-tool-bar') {
            return false;
        }

        const toolBarContainer = (parent);
        if (toolBarContainer.ToolBar) {
            // already exists. Just ignore it (carefully)
            return false;
        }

        const toolBar: QPToolBar = {
            Type: AcuElementType.ToolBar,
            Id: concatElementID(parent.Id, htmlElement),
            ToolBarType: QPToolBarType.List,
            Items: [],
            ShowRightAction: false,
            ShowSaveButton: false,
        };

        this.visitToolBar(htmlElement, toolBar);
        if (toolBar.Items.length === 0) {
            return false;
        }

        for (const item of toolBar.Items) {
            if (item.ItemType === QPToolBarItemType.Button
                && (item as QPToolBarItemButton).Icon == IconType.First) {
                toolBar.ToolBarType = QPToolBarType.Record;
                break;
            }
        }

        toolBarContainer.ToolBar = toolBar;
        return true;
    }

    visitToolBar(htmlElement: Element, toolBar: QPToolBar): void {
        const divElement = findElementByNodeNameDown(htmlElement, 'div');
        if (!divElement) {
            return;
        }

        for (const toolBarElement of divElement.children) {
            if (isHiddenElement(toolBarElement)) {
                continue;
            }

            switch (toolBarElement.nodeName.toLowerCase()) {
            case 'ul': {
                for (const liElement of toolBarElement.children) {
                    const toolBarItem = this.getToolBarItem(liElement);
                    if (toolBarItem) {
                        toolBar.Items.push(toolBarItem);
                    }
                }
                break;
            }
            default:
                if (findClasses(toolBarElement, 'qp-tool-bar-opener')) {
                    const toolBarItem = this.getToolBarItem(toolBarElement);
                    toolBar.Items.push(toolBarItem);
                }
                break;
            }
        }
    }

    getToolBarItem(buttonElement: Element): QPToolBarItem {
        const iconType = getIconType(buttonElement);
        let text: string | null = null;

        const textElement = findElementByClassesDown(buttonElement, 'qp-tool-bar-text');
        if (textElement) {
            text = textElement.textContent?.trim() ?? null;
        }

        const enabled = !isElementDisabled(buttonElement);
        const buttonStyle = getButtonStyle(buttonElement);

        return {
            ItemType: QPToolBarItemType.Button,
            Icon: iconType,
            Enabled: enabled,
            Style: buttonStyle,
            Text: text,
        } as QPToolBarItemButton;
    }
}