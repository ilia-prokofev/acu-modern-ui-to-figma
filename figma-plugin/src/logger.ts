import {FigmaNode} from './figma-node';
import {QPField} from '@modern-ui-to-figma/elements';

export class Logger {
    log: string[] = [];

    Warn(message: string,
        id: string | null = null,
        node: FigmaNode | InstanceNode | PageNode | GroupNode | FrameNode | ComponentNode | QPField | null = null,
    ): void {
        const messageAndID = `${message.replace(/\n/g, '\t')} (id: ${id})`;
        this.log.push(messageAndID);
        console.warn(messageAndID, node);
    }

    Log(message: string): void {
        this.log.push(message);
        console.log(message);
    }

    Clear(): void {
        this.log = [];
    }

    GetLog(): string {
        return this.log.join('\n');
    }
}
