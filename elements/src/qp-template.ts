import {AcuContainer} from './acu-container';
import {AcuElementType} from './acu-element';

export enum LabelLength {
    s = 's',
    sm = 'sm',
    m = 'm',
    xm = 'xm',
}

export interface Template extends AcuContainer {
    Type: AcuElementType.Template;
    Name: string | null;
	LabelLength: LabelLength;
}